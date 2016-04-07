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
       ES6 deferreds
       
     - Girder relies on its own internal g:event
       events instead of the standard Backbone
       change, create, sync, etc callbacks
       
       This file attempts to restore the default
       events when they're supposed to happen
       (TODO: I still need to work on this)
       
     - Girder ignores+discards 'meta' when syncing!
     
       This file patches it by syncing metadata
       before the rest of the model
       
  2. Do smart(ish) things with items in the user's
     private folder and the public scratch space
*/

let MetadataItem = girder.models.ItemModel.extend({
  // idAttribute: '_id',

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
    let errorFunc = () => {
      let defaultErrorFunc = options.error || (() => {
        throw new Error('Error syncing MetadataItem');
      });
      defaultErrorFunc(arguments);
      if (options.silent !== true) {
        // self.trigger('error');
      }
    };
    let successFunc = () => {
      let defaultSuccessFunc = options.success || (() => {});
      defaultSuccessFunc(arguments);
      if (options.silent !== true) {
        // self.trigger('sync');
        // self.trigger('change');
      }
    };

    if (method === 'create') {
      // By default, we want to save new items in the user's
      // Private folder or in the public scratch space:

      return Promise.resolve(girder.restRequest({
        path: 'item/scratchItem',
        data: {
          name: self.get('name'),
          description: self.get('description') || '',
          reuseExisting: false
        },
        type: 'GET',
        error: errorFunc
      })).then((resp) => {
        // This will assign us our new ID:
        self.set(resp, {
          silent: true
        });

        // And now we want to finish creating
        // the item by saving our current state
        // (this calls sync again, but that's
        // a good thing in case we have metadata)
        self.sync('update', model, options);
      }).catch((err) => {
        errorFunc(err.responseJSON.message);
      });
    } else if (method === 'update') {
      // When we update, we want to sync our
      // metadata before we sync the rest,
      // or else it will get nuked
      return Promise.resolve(girder.restRequest({
        path: '/item/' + self.getId() + '/metadata',
        contentType: 'application/json',
        data: JSON.stringify(self.get('meta')),
        type: 'PUT',
        error: errorFunc
      })).then((resp) => {
        // Okay, go ahead and finish the sync the girder way
        self.listenToOnce(self, 'g:saved', successFunc);
        self.listenToOnce(self, 'g:error', errorFunc);
        girder.models.ItemModel.prototype.save.apply(self);
      }).catch((err) => {
        errorFunc(err.responseJSON.message);
      });
    } else if (method === 'read') {
      if (self.getId() === undefined) {
        // If we haven't yet identified the id, look for it
        // in the Private folder by item name / create
        // an item there if it doesn't exist
        return Promise.resolve(girder.restRequest({
          path: 'item/privateItem',
          data: {
            name: self.get('name'),
            description: self.get('description') || ''
          },
          type: 'GET',
          error: errorFunc
        })).then((resp) => {
          // Load up everything we just got
          self.set(resp, {
            silent: true
          });
          successFunc(self.toJSON(), resp, options);
        }).catch((err) => {
          errorFunc(err.responseJSON.message);
        });
      } else {
        // Otherwise, just go with the default girder behavior
        self.listenToOnce(self, 'g:fetched', successFunc);
        self.listenToOnce(self, 'g:error', errorFunc);
        return Promise.resolve(girder.models.ItemModel.prototype.fetch.apply(self));
      }
    } else if (method === 'delete') {
      // We'll already have an id if there's something to delete...
      // so just use the default girder behavior
      self.listenToOnce(self, 'g:deleted', successFunc);
      self.listenToOnce(self, 'g:error', errorFunc);
      let promise = Promise.resolve(girder.models.ItemModel.prototype.destroy.apply(self));
      // In the mean time let's delete the id so we
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
    self.set(attributes, {
      silent: true
    });
    self.unset(self.idAttribute, {
      silent: true
    });
    return self.sync('create', self.toJSON(), options);
  },
  save: function (attributes, options) {
    let self = this;
    self.set(attributes, options);
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
