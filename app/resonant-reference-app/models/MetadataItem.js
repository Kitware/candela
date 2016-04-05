let girder = window.girder;

/*
  This class is meant to:
  1. Patch where Girder breaks backbone syncing
  2. Do smart things with the Private folder
     when we only have an item name, but no
     id yet... e.g. the user just logged in
  3. Fail sync() attempts passively when we're
     not logged in
*/

let MetadataItem = girder.models.ItemModel.extend({
  // idAttribute: '_id',

  sync: function (method, model, options) {
    let self = this;
    options = options || {};
    let errorFunc = options.error || (() => {
      self.syncError(arguments);
    });

    if (method === 'create') {
      // By default, we want to save new items in the user's
      // Private folder... so we're going to ask the server
      // to create a new private item. If it already happens
      // to exist, we use / overwrite the item that's there

      girder.restRequest({
        path: 'item/privateItem',
        data: {
          name: self.get('name'),
          description: self.get('description') || ''
        },
        type: 'GET',
        error: errorFunc
      }).done((resp) => {
        // This will assign us our new ID:
        self.set(resp);

        // And now we want to finish creating
        // the item by saving our current state
        // (this calls sync again, but that's
        // a good thing in case we have metadata)
        self.sync('update', model, options);
      }).error((err) => {
        errorFunc(err.responseJSON.message);
      });
    } else if (method === 'update') {
      // When we update, we want to sync our
      // metadata before we sync the rest,
      // or else it will get nuked
      girder.restRequest({
        path: '/item/' + this.get(self.idAttribute) + '/metadata',
        contentType: 'application/json',
        data: JSON.stringify(self.get('meta')),
        type: 'PUT',
        error: errorFunc
      }).done((resp) => {
        // Okay, go ahead and finish the sync the girder way
        girder.models.ItemModel.prototype.save.apply(self);
      }).error((err) => {
        errorFunc(err.responseJSON.message);
      });
    } else if (method === 'read') {
      if (self.get(self.idAttribute) === undefined) {
        // If we haven't yet identified the id, so look
        // in the Private folder by item name
        girder.restRequest({
          path: 'item/privateItem',
          data: {
            name: self.get('name'),
            description: self.get('description') || ''
          },
          type: 'GET',
          error: errorFunc
        }).done((resp) => {
          // Load up everything we just got
          self.set(resp);
          if (options.success) {
            options.success(self.toJSON(), resp, options);
          }
        }).error((err) => {
          errorFunc(err.responseJSON.message);
        });
      } else {
        // Otherwise, just go with the default girder behavior
        girder.models.ItemModel.prototype.fetch.apply(self);
      }
    } else if (method === 'delete') {
      // I think we can safely assume we'll have an id if we
      // want to delete something... so just use the default girder behavior
      girder.models.ItemModel.prototype.destroy.apply(self);
      // Now let's delete the id so we don't go thinking we're synced anymore
      self.unset(self.idAttribute);
    }
    return self;
  },
  syncError: function (message) {
    console.warn('Encountered a MetadataItem sync error:', message);
  },
  fetch: function (options) {
    let self = this;
    self.sync('read', self.toJSON(), options);
  },
  save: function (attributes, options) {
    let self = this;
    self.set(attributes);
    if (self.get(self.idAttribute) === undefined) {
      self.sync('create', self.toJSON(), options);
    } else {
      self.sync('update', self.toJSON(), options);
    }
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
  getMeta: function (key) {
    let self = this;
    let meta = self.get('meta');
    meta = meta || {};
    if (key !== undefined) {
      return meta[key];
    } else {
      return meta;
    }
  }
});

export default MetadataItem;
