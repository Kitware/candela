import jQuery from 'jquery';
let girder = window.girder;

/*
  This class is meant to:
  1. Patch where Girder breaks backbone syncing
     - Girder doesn't support the
       {
         success: function () {},
         error: function () {}
       }
       way of handling the asynchronous calls

       This file patches that support back. It also
       converts girder's jQuery deferreds into
       ES6 promises

     - Girder relies on its own internal g:event
       events instead of the standard Backbone
       change, create, sync, etc callbacks

       This file attempts to restore the default
       events when they're supposed to happen
       (TODO: I still need to work on this)

     - Girder ignores+discards 'meta' when syncing!

       We use our own custom endpoint to sync metadata
       with the rest of the Item

  2. Do smart(ish) things with items in the user's
     private folder and the anonymous user's scratch
     space (the server endpoints handle most of this
     logic)

  3. Namespace Resonant Laboratory's specific metadata
     under an 'rlab' key so that it plays nicely with other
     girder-based projects
*/

function MetadataSyncError () {}
MetadataSyncError.prototype = new Error();

let MetadataItem = girder.models.ItemModel.extend({
  // idAttribute: '_id',
  wrapInPromise: function (executor, options, beforeSuccess, callbacks) {
    /*
      I do some sneaky stuff here. There are three ways
      callbacks and errors are fired / caught across
      Backbone and Girder:

      - options object ('success' and 'error' functions)
      - jQuery deferreds
      - g:events

      This function tries to capture and route all of
      them appropriately.
    */

    let promiseObj = new Promise(executor);

    if (callbacks) {
      /*
        Crap. We actually won't know the result
        of the call until an event is fired.
        We'll wait for a few seconds for the events before
        rejecting the promise because we never heard back
      */
      let timeout, forceResolve, forceReject;

      let waiter = new Promise((resolve, reject) => {
        forceResolve = resolve;
        forceReject = reject;
      });
      promiseObj = Promise.all([promiseObj, waiter]);

      this.listenToOnce(this, callbacks.successEvent, function () {
        window.clearTimeout(timeout);
        forceResolve.apply(waiter, arguments);
      });
      this.listenToOnce(this, callbacks.errorEvent, function () {
        window.clearTimeout(timeout);
        forceReject.apply(waiter, arguments);
      });

      timeout = window.setTimeout(() => {
        forceReject(new Error(`MetadataItem timed out waiting for
        an event from Girder.`));
      }, 20000);
    }

    // beforeSuccess is a function that should
    // be called before options.success
    beforeSuccess = beforeSuccess || (d => d);

    var self = this;
    promiseObj.then(function (resp) {
      // Things were successful; call beforeSuccess first,
      // and then call options.success if it exists
      resp = beforeSuccess.apply(self, arguments);
      if (options.success) {
        options.success.apply(self, arguments);
      }
      return resp;
    });

    if (options.error) {
      /*
        Attaching .catch() resumes the Promise chain,
        which we DON'T want to do unless the user has
        explicitly supplied an error catching function
      */
      promiseObj.catch(options.error);
    }

    return promiseObj;
  },
  triggerCommunicationError: function (errorObj) {
    if (errorObj.status === 401) {
      // Authentication failures simply mean that the user is logged out;
      // we can ignore these
      return;
    }
    // Some other server error has occurred...
    let newErrorObj = new Error('Error communicating with the server');
    let details = '';
    if (errorObj.status) {
      details += '\nStatus: ' + errorObj.status + '\n';
    }
    if (errorObj.message) {
      details += '\nMessage:\n' + errorObj.message;
    } else if (errorObj.responseJSON && errorObj.responseJSON.message) {
      details += '\nMessage:\n' + errorObj.responseJSON.message;
    }
    if (errorObj.stack) {
      details += '\nStack Trace:\n' + errorObj.stack;
    }
    if (errorObj.responseJSON && errorObj.responseJSON.trace) {
      details += '\nStack Trace:\n';
      errorObj.responseJSON.trace.forEach(traceDetails => {
        details += '\n' + traceDetails[0];
        details += '\n' + traceDetails[1] + '\t' + traceDetails[2];
        details += '\n' + traceDetails[3] + '\n';
      });
    }
    if (details.length > 0) {
      newErrorObj.details = details;
    }
    window.mainPage.trigger('rl:error', newErrorObj);
  },
  restRequest: function (requestParameters, options) {
    options = options || {};
    return this.wrapInPromise((resolve, reject) => {
      requestParameters.path = 'item/' + this.getId() + '/' + requestParameters.path;
      requestParameters.error = reject;
      return girder.restRequest(requestParameters).done(resolve).error(reject);
    }, options, resp => {
      if (resp.hasOwnProperty('__copiedItemId__')) {
        // The id of the item changed in the process (e.g. a copy of
        // the item was made because the user had read, but not write access)
        let oldId = this.getId();
        this.set('__originalItemId__', resp['__originalItemId__']);
        this.set(this.idAttribute, resp['__copiedItemId__']);
        delete resp['__originalItemId__'];
        delete resp['__copiedItemId__'];
        this.trigger('rl:swappedId', oldId);
      }
      return resp;
    }).catch(errorObj => {
      this.triggerCommunicationError(errorObj);
    });
  },
  sync: function (method, model, options) {
    options = options || {};

    // Clear any leftover girder callbacks
    this.stopListening(this, 'g:error');
    this.stopListening(this, 'g:saved');
    this.stopListening(this, 'g:fetched');
    this.stopListening(this, 'g:deleted');

    // Error and success functions to make sure
    // the regular events get fired

    if (method === 'create') {
      // By default, we want to save new items in the user's
      // Private folder or in the public scratch space:
      return this.wrapInPromise((resolve, reject) => {
        // If we've reached this point, we must have
        // specified a name for the item
        if (!this.get('name')) {
          reject(new MetadataSyncError('Item must have a name to be created'));
        }
        girder.restRequest({
          path: 'item/anonymousAccess/scratchItem',
          data: {
            name: this.get('name'),
            description: this.get('description') || '',
            reuseExisting: false
          },
          error: reject,
          type: 'POST'
        }).done(resolve).error(reject);
      }, options, resp => {
        // This *should* assign us our new ID:
        this.set(resp, {
          silent: true
        });

        if (!this.getId()) {
          throw new Error('Got a scratch item without an ID');
        } else {
          // And now we want to finish creating
          // the item by saving our current state
          // (this calls sync again, but that's
          // a good thing in case we have metadata)
          return this.sync('update', model, options);
        }
      });
    } else if (method === 'update') {
      // When we update, we sync to our custom endpoint
      // (does two things: syncs metadata with the
      // rest of the item, as well as doing fancy
      // user state logic)
      let args = {
        name: this.get('name')
      };
      let desc = this.get('description');
      if (desc) {
        args.description = desc;
      }

      if (!this.getId()) {
        // We don't have anywhere to save to! Create
        // the item instead
        return this.sync('create', model, options);
      }

      return this.restRequest({
        path: 'anonymousAccess/updateScratch?' +
          jQuery.param(args),
        contentType: 'application/json',
        data: JSON.stringify({
          rlab: this.getFlatMeta()
        }),
        type: 'POST'
      }, options);
    } else if (method === 'read') {
      if (this.getId() === undefined) {
        // If we haven't yet identified the id, look for it
        // in the Private folder by item name / create
        // an item there if it doesn't exist
        return this.wrapInPromise((resolve, reject) => {
          girder.restRequest({
            path: 'item/anonymousAccess/privateItem',
            data: {
              name: this.get('name') || 'Untitled Item',
              description: this.get('description') || ''
            },
            type: 'POST',
            error: reject
          }).done(resolve).error(reject);
        }, options, (resp) => {
          // Load up everything we just got
          this.set(resp, {
            silent: true
          });
          return resp;
        });
      } else {
        // Otherwise, just go with the default girder behavior
        return this.wrapInPromise((resolve, reject) => {
          try {
            resolve(girder.models.ItemModel.prototype.fetch.apply(this));
          } catch (errorObj) {
            reject(errorObj);
          }
        }, options, null, {
          successEvent: 'g:fetched',
          errorEvent: 'g:error'
        });
      }
    } else if (method === 'delete') {
      // We'll already have an id if there's something to delete...
      // so just use the default girder behavior
      let promise = this.wrapInPromise((resolve, reject) => {
        try {
          resolve(girder.models.ItemModel.prototype.destroy.apply(this));
        } catch (errorObj) {
          reject(errorObj);
        }
      }, options, null, {
        successEvent: 'g:deleted',
        errorEvent: 'g:error'
      });
      // In the mean time let's clear the id so we
      // don't go thinking we're synced anymore
      this.unset(this.idAttribute, {
        silent: true
      });
      return promise;
    }
  },
  fetch: function (options) {
    return this.sync('read', this.toJSON(), options)
      .catch(errorObj => {
        this.triggerCommunicationError(errorObj);
      });
  },
  create: function (attributes, options) {
    if (attributes) {
      this.set(attributes, {
        silent: true
      });
    }
    this.unset(this.idAttribute, {
      silent: true
    });
    return this.sync('create', this.toJSON(), options)
      .catch(errorObj => {
        this.triggerCommunicationError(errorObj);
      });
  },
  save: function (attributes, options) {
    if (attributes) {
      this.set(attributes, options);
    }
    return this.sync('update', this.toJSON(), options)
      .catch(errorObj => {
        this.triggerCommunicationError(errorObj);
      });
  },
  destroy: function (options) {
    return this.sync('delete', this.toJSON(), options)
      .catch(errorObj => {
        this.triggerCommunicationError(errorObj);
      });
  },
  setMeta: function (key, value) {
    let meta = this.get('meta');
    meta = meta || {};
    meta.rlab = meta.rlab || {};
    if (typeof key === 'object') {
      let obj = key;
      for (key of Object.keys(obj)) {
        if (obj[key] === null) {
          delete meta.rlab[key];
        } else {
          meta.rlab[key] = obj[key];
        }
      }
    } else {
      if (value === null) {
        delete meta.rlab[key];
      } else {
        meta.rlab[key] = value;
      }
    }
    this.set('meta', meta);
  },
  unsetMeta: function (key) {
    let meta = this.get('meta');
    meta = meta || {};
    meta.rlab = meta.rlab || {};
    if (key !== undefined) {
      meta.rlab[key] = null;
      this.setMeta(meta);
    } else {
      this.unset('meta');
    }
  },
  getFlatMeta: function () {
    // By default, there's no flattening to do
    return this.getMeta();
  },
  getMeta: function (key) {
    let meta = this.get('meta');
    meta = meta || {};
    meta.rlab = meta.rlab || {};
    if (key !== undefined) {
      return meta.rlab[key];
    } else {
      return meta.rlab;
    }
  },
  getId: function () {
    return this.get(this.idAttribute);
  },
  previousMeta: function (key) {
    let prevMeta = this.previous('meta');
    prevMeta = prevMeta || {};
    prevMeta.rlab = prevMeta.rlab || {};
    if (key !== undefined) {
      return prevMeta.rlab[key];
    } else {
      return prevMeta.rlab;
    }
  },
  hasMetaChanged: function (key, eqFunc) {
    eqFunc = eqFunc || ((a, b) => {
      return a === b;
    });
    if (key === undefined) {
      return this.hasChanged('meta');
    } else {
      return !eqFunc(this.previousMeta(key), this.getMeta(key));
    }
  },
  rename: function (newName) {
    this.set('name', newName);
    return this.save().then(() => {
      this.trigger('rl:rename');
    });
  }
});

export default MetadataItem;
