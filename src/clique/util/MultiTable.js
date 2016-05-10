export default class MultiTable {
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

