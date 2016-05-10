import _ from 'underscore';

import Adapter from './Adapter';
import { deepCopy } from '../../candela/util';

export default class NodeLinkList extends Adapter {
  constructor (nodes, links) {
    super();

    this.nodes = nodes;
    this.links = links;

    let table = [];
    _.each(this.nodes, (node, i) => {
      // Compute a suitable temporary namespace.
      let tmpNs = 'datax';
      while (node.hasOwnProperty(tmpNs)) {
        tmpNs += 'x';
      }

      // Create the namespace on the node.
      let ns = node[tmpNs] = {};

      // Move all top-level properties into the namespace.
      _.each(node, (v, k) => {
        if (k !== tmpNs) {
          ns[k] = v;
          delete node[k];
        }
      });

      // Rename the temp namespace to "data".
      if (tmpNs !== 'data') {
        node.data = ns;
        delete node[tmpNs];
      }

      node.key = _.uniqueId('node_');

      table.push(node);
    });

    _.each(this.links, link => {
      link.key = _.uniqueId('link_');

      link.source = table[link.source];
      link.target = table[link.target];
    });
  }

  findNodesRaw (_spec, offset, limit) {
    const spec = deepCopy(_spec);
    let searchspace = this.nodes;

    if (spec.key) {
      searchspace = _.filter(searchspace, node => node.key === spec.key);
      delete spec.key;
    }

    let result = _.filter(searchspace, node => _.isMatch(node.data, spec));
    return result.slice(offset, _.isNull(limit) ? undefined : (offset + limit));
  }

  findLinksRaw (_spec, source, target, directed, offset, limit) {
    const spec = deepCopy(_spec);
    let searchspace = this.links;

    if (spec.key) {
      searchspace = _.filter(searchspace, link => link.key === spec.key);
      delete spec.key;
    }

    return _.filter(searchspace, link => {
      const sourceMatch = _.isNull(source) || (link.source.key === source);
      const targetMatch = _.isNull(target) || (link.target.key === target);
      const dataMatch = _.isMatch(link.data, spec);
      const directedMatch = _.isNull(directed) ? true : (directed ? !link.undirected : link.undirected);

      return sourceMatch && targetMatch && dataMatch && directedMatch;
    }).slice(offset, _.isNull(limit) ? undefined : (offset + limit));
  }
}
