import _ from 'underscore';
import Backbone from 'backbone';
// import Set from 'es6-set';

export function deepCopy (o) {
  if (_.isUndefined(o)) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(o));
}

export function concat (...lists) {
  return [].concat(...lists);
}

export class MultiTable {
  constructor () {
    this.table = {};
  }

  add (key, item) {
    let table = this.table;

    if (!table.hasOwnProperty(key)) {
      table[key] = new Set();
    }

    table[key].add(item);
  }

  remove (key, item) {
    let table = this.table;

    if (table.hasOwnProperty(key)) {
      table[key].delete(item);
    }
  }

  strike (key) {
    delete this.table[key];
  }

  has (key, item) {
    let table = this.table;

    return table.hasOwnProperty(key) && (item === undefined || table[key].has(item));
  }

  items (key) {
    let table = this.table;

    if (table.hasOwnProperty(key)) {
      return [...table[key].values()];
    }
  }
}

export function Accessor (raw) {
  var disallowed = new Set();

  raw.data = raw.data || {};

  _.each(['key', 'source', 'target', 'data'], function (d) {
    disallowed.add(d);
  });

  return _.extend({
    key: function () {
      return raw.key;
    },

    source: function () {
      return raw.source.key || raw.source;
    },

    target: function () {
      return raw.target.key || raw.target;
    },

    getAttribute: function (prop) {
      if (disallowed.has(prop)) {
        return;
      }
      return raw[prop];
    },

    setAttribute: function (prop, value) {
      if (disallowed.has(prop)) {
        return false;
      }

      raw[prop] = value;
      return true;
    },

    clearAttribute: function (prop) {
      if (disallowed.has(prop)) {
        return false;
      }

      delete raw[prop];
      return true;
    },

    getAllAttributes: function () {
      var result = {};

      _.each(raw, function (value, key) {
        if (!disallowed.has(key)) {
          result[key] = value;
        }
      });

      return result;
    },

    getData: function (prop) {
      return raw.data[prop];
    },

    setData: function (prop, value) {
      raw.data[prop] = value;
      this.trigger('changed', this, prop, value);
    },

    clearData: function (prop) {
      delete raw.data[prop];
      this.trigger('cleared', this, prop);
    },

    getAllData: function () {
      var result = {};

      _.each(raw.data, function (value, key) {
        result[key] = value;
      });

      return result;
    },

    getRaw: function () {
      return raw;
    }
  }, Backbone.Events);
}
