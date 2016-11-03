// UpSet shim: currently UpSet overrides the ES6 Set definition;
// this is an ugly patch to give us basic Set functionality back

/* eslint-disable no-extend-native */
export function Set (initialMembers) {
  this.contents = {};
  if (initialMembers) {
    initialMembers.forEach(m => {
      this.contents[m] = true;
    });
  }
}
Set.prototype.add = function (member) {
  this.contents[member] = true;
};
Set.prototype.delete = function (member) {
  delete this.contents[member];
};
Set.prototype.has = function (member) {
  return this.contents[member] === true;
};
Set.prototype[Symbol.iterator] = function () {
  let self = this;
  return {
    _keys: Object.keys(self.contents),
    _index: -1,
    next: function () {
      this._index += 1;
      if (this._index >= this._keys.length) {
        return {
          done: true
        };
      } else {
        return {
          value: this._keys[this._index],
          done: false
        };
      }
    }
  };
};
Object.defineProperty(Set.prototype, 'size', {
  get: function size () {
    return Object.keys(this.contents).length;
  }
});
/* eslint-enable no-extend-native */

// Some quick ugly patches for nicer set operation syntax.
// TODO: find a library that does this better, or wait for
// native ES6 support

export default {
  union: function (a, b) {
    return new Set([...a, ...b]);
  },
  intersection: function (a, b) {
    return new Set([...a].filter(x => b.has(x)));
  },
  difference: function (a, b) {
    return new Set([...a].filter(x => !b.has(x)));
  },
  symmetric_difference: function (a, b) {
    let result = new Set([...a]);
    for (let v of b) {
      if (result.has(v)) {
        result.delete(v);
      } else {
        result.add(v);
      }
    }
    return result;
  }
};
