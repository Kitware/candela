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
*/

let MetadataItem = girder.models.ItemModel.extend({
  // idAttribute: '_id',
  wrapInPromise: function (promiseObj, options, beforeSuccess, callbacks) {
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
    let self = this;

    promiseObj = Promise.resolve(promiseObj);

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

      self.listenToOnce(self, callbacks.successEvent, function () {
        window.clearTimeout(timeout);
        forceResolve.apply(waiter, arguments);
      });
      self.listenToOnce(self, callbacks.errorEvent, function () {
        window.clearTimeout(timeout);
        forceReject.apply(waiter, arguments);
      });

      timeout = window.setTimeout(() => {
        forceReject(new Error(`MetadataItem timed out waiting for
        an event from Girder.`));
      }, 10000);
    }

    // beforeSuccess is a function that should
    // be called before options.success
    beforeSuccess = beforeSuccess || (() => {});

    promiseObj.then(function () {
      // Things were successfully; call whatToDo first,
      // and then call options.success if it exists
      beforeSuccess.apply(self, arguments);
      if (options.success) {
        options.success.apply(self, arguments);
      }
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
  sync: function (method, model, options) {
    let self = this;
    options = options || {};

    // Clear any leftover girder callbacks
    self.stopListening(self, 'g:error');
    self.stopListening(self, 'g:saved');
    self.stopListening(self, 'g:fetched');
    self.stopListening(self, 'g:deleted');

    // Error and success functions to make sure
    // the regular events get fired

    if (method === 'create') {
      // By default, we want to save new items in the user's
      // Private folder or in the public scratch space:

      return self.wrapInPromise(girder.restRequest({
        path: 'item/scratchItem',
        data: {
          name: self.get('name'),
          description: self.get('description') || '',
          reuseExisting: false
        },
        type: 'GET'
      }), options, (resp) => {
        // This *should* assign us our new ID:
        self.set(resp, {
          silent: true
        });
        
        if (!self.getId()) {
          throw new Error('Got a scratch item without an ID');
        } else {
          // And now we want to finish creating
          // the item by saving our current state
          // (this calls sync again, but that's
          // a good thing in case we have metadata
          
          self.sync('update', model, options);
        }
      });
    } else if (method === 'update') {
      // When we update, we sync to our custom endpoint
      // (does two things: syncs metadata with the
      // rest of the item, as well as doing fancy
      // user state logic)
      let args = {
        name: self.get('name')
      };
      let desc = self.get('description');
      if (desc) {
        args.description = desc
      }
      
      if (!self.getId()) {
        // We don't have anywhere to save to! Create
        // the item instead
        return self.sync('create', model, options);
      }
      
      return self.wrapInPromise(girder.restRequest({
        path: 'item/' + self.getId() + '/updateScratch?' +
          jQuery.param(args),
        contentType: 'application/json',
        data: JSON.stringify(self.get('meta')),
        type: 'POST'
      }), options, (resp) => {
        // It's possible that the id changed
        // in the process (e.g. a copy of
        // the toolchain was made
        // because the user is logged out)
        self.set(resp, {
          silent: true
        });
      });
    } else if (method === 'read') {
      if (self.getId() === undefined) {
        // If we haven't yet identified the id, look for it
        // in the Private folder by item name / create
        // an item there if it doesn't exist
        return self.wrapInPromise(girder.restRequest({
          path: 'item/privateItem',
          data: {
            name: self.get('name') || 'Untitled Item',
            description: self.get('description') || ''
          },
          type: 'GET'
        }), options, (resp) => {
          // Load up everything we just got
          self.set(resp, {
            silent: true
          });
        });
      } else {
        // Otherwise, just go with the default girder behavior
        return self.wrapInPromise(
          girder.models.ItemModel.prototype.fetch.apply(self),
          options, null, {
            successEvent: 'g:fetched',
            errorEvent: 'g:error'
          });
      }
    } else if (method === 'delete') {
      // We'll already have an id if there's something to delete...
      // so just use the default girder behavior
      let promise = self.wrapInPromise(
        girder.models.ItemModel.prototype.destroy.apply(self),
        options, null, {
          successEvent: 'g:deleted',
          errorEvent: 'g:error'
        });
      // In the mean time let's clear the id so we
      // don't go thinking we're synced anymore
      self.unset(self.idAttribute, {
        silent: true
      });
      return promise;
    }
  },
  fetch: function (options) {
    let self = this;
    return self.sync('read', self.toJSON(), options);
  },
  create: function (attributes, options) {
    let self = this;
    if (attributes) {
      self.set(attributes, {
        silent: true
      });
    }
    self.unset(self.idAttribute, {
      silent: true
    });
    return self.sync('create', self.toJSON(), options);
  },
  save: function (attributes, options) {
    let self = this;
    if (attributes) {
      self.set(attributes, options);
    }
    return self.sync('update', self.toJSON(), options);
  },
  destroy: function (options) {
    let self = this;
    return self.sync('delete', self.toJSON(), options);
  },
  setMeta: function (key, value) {
    let self = this;
    let meta = self.get('meta');
    meta = meta || {};
    if (typeof key === 'object') {
      let obj = key;
      for (key of Object.keys(obj)) {
        meta[key] = obj[key];
      }
    } else {
      meta[key] = value;
    }
    self.set('meta', meta);
  },
  unsetMeta: function (key) {
    let self = this;
    let meta = self.get('meta');
    meta = meta || {};
    if (key !== undefined) {
      meta[key] = null;
      self.set('meta', meta);
    } else {
      self.unset('meta');
    }
  },
  getMeta: function (key) {
    let self = this;
    let meta = self.get('meta');
    meta = meta || {};
    if (key !== undefined) {
      return meta[key];
    } else {
      return meta;
    }
  },
  getId: function () {
    let self = this;
    return self.get(self.idAttribute);
  },
  previousMeta: function (key) {
    let self = this;
    let prevMeta = self.previous('meta');
    prevMeta = prevMeta || {};
    if (key !== undefined) {
      return prevMeta[key];
    } else {
      return prevMeta;
    }
  },
  hasMetaChanged: function (key, eqFunc) {
    let self = this;
    eqFunc = eqFunc || function (a, b) {
      return a === b;
    };
    if (key === undefined) {
      return self.hasChanged('meta');
    } else {
      return !eqFunc(self.previousMeta(key), self.getMeta(key));
    }
  }
});

export default MetadataItem;
