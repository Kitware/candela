import _ from 'underscore';
import { concat, deepCopy, Accessor } from './util';
import $ from 'jquery';

export default class Adapter {
  constructor () {
    this.accessors = {};
  }

  onNewAccessor () {}

  addAccessor (blob) {
    let acc = this.accessors[blob.key];
    if (_.isUndefined(acc)) {
      acc = this.accessors[blob.key] = new Accessor(blob);
      this.onNewAccessor(acc);
    }

    return acc;
  }

  getAccessor (key) {
    return this.accessors[key];
  }

  findNodes (spec, {offset = 0, limit = null} = {}) {
    return $.when(this.findNodesRaw(spec, offset, limit))
      .then(results => results.map(x => this.addAccessor(x)));
  }

  findNode (spec) {
    const req = this.findNodes(spec, {offset: 0, limit: 1});
    return $.when(req)
      .then(results => results && results[0]);
  }

  findNodeByKey (key) {
    return this.findNode({ key });
  }

  findLinks (spec, {source = null, target = null, directed = null, offset = 0, limit = null} = {}) {
    return $.when(this.findLinksRaw(spec, source, target, directed, offset, limit))
      .then(results => results.map(x => this.addAccessor(x)));
  }

  findLink (dataSpec, _spec) {
    const spec = Object.assign({}, _spec, { offset: 0, limit: 1 });
    return $.when(this.findLinks(dataSpec, spec))
      .then(results => results && results[0]);
  }

  findLinkByKey (key) {
    return this.findLink({ key });
  }

  neighborLinkCount (node, opts) {
    return this.neighborLinks(node, opts)
      .then(results => results.length);
  }

  outgoingLinkCount (node) {
    return this.neighborLinkCount(node, {
      outgoing: true,
      incoming: false,
      undirected: false
    });
  }

  outflowingLinkCount (node) {
    return this.neighborLinkCount(node, {
      outgoing: true,
      incoming: false,
      undirected: true
    });
  }

  incomingLinkCount (node) {
    return this.neighborLinkCount(node, {
      outgoing: false,
      incoming: true,
      undirected: false
    });
  }

  inflowingLinkCount (node) {
    return this.neighborLinkCount(node, {
      outgoing: false,
      incoming: true,
      undirected: true
    });
  }

  undirectedLinkCount (node) {
    return this.neighborLinkCount(node, {
      outgoing: false,
      incoming: false,
      undirected: true
    });
  }

  directedLinkCount (node) {
    return this.neighborLinkCount(node, {
      outgoing: true,
      incoming: true,
      undirected: false
    });
  }

  neighborLinks (node, {outgoing = true, incoming = true, undirected = true} = {}, {offset = 0, limit = null} = {}) {
    return this.neighborLinksRaw(node, {outgoing, incoming, undirected}, offset, limit)
      .then(results => results.map(x => this.addAccessor(x)));
  }

  outgoingLinks (node, slice) {
    return this.neighborLinks(node, {
      outgoing: true,
      incoming: false,
      undirected: false
    }, slice);
  }

  outflowingLinks (node, slice) {
    return this.neighborLinks(node, {
      outgoing: true,
      incoming: false,
      undirected: true
    }, slice);
  }

  incomingLinks (node, slice) {
    return this.neighborLinks(node, {
      outgoing: false,
      incoming: true,
      undirected: false
    }, slice);
  }

  inflowingLinks (node, slice) {
    return this.neighborLinks(node, {
      outgoing: false,
      incoming: true,
      undirected: true
    }, slice);
  }

  undirectedLinks (node, slice) {
    return this.neighborLinks(node, {
      outgoing: false,
      incoming: false,
      undirected: true
    }, slice);
  }

  directedLinks (node, slice) {
    return this.neighborLinks(node, {
      outgoing: true,
      incoming: true,
      undirected: false
    }, slice);
  }

  neighborNodeCount (node, types) {
    return this.neighborNodes(node, types)
      .then(neighbors => neighbors.length);
  }

  outgoingNodeCount (node) {
    return this.neighborNodeCount(node, {
      outgoing: true,
      incoming: false,
      undirected: false
    });
  }

  outflowingNodeCount (node) {
    return this.neighborNodeCount(node, {
      outgoing: true,
      incoming: false,
      undirected: true
    });
  }

  incomingNodeCount (node) {
    return this.neighborNodeCount(node, {
      outgoing: false,
      incoming: true,
      undirected: false
    });
  }

  inflowingNodeCount (node) {
    return this.neighborNodeCount(node, {
      outgoing: false,
      incoming: true,
      undirected: true
    });
  }

  undirectedNodeCount (node) {
    return this.neighborNodeCount(node, {
      outgoing: false,
      incoming: false,
      undirected: true
    });
  }

  directedNodeCount (node) {
    return this.neighborNodeCount(node, {
      outgoing: true,
      incoming: true,
      undirected: false
    });
  }

  neighborNodes (node, types, slice) {
    const key = node.key();
    let links;

    return this.neighborLinks(node, types, slice)
      .then(nlinks => {
        links = nlinks;

        let neighborKeys = links.map(link => key === link.source() ? link.target() : link.source());

        let accs = neighborKeys.map((key, i) => {
          let acc = this.getAccessor(key);
          if (!acc) {
            return this.findNodeByKey(neighborKeys[i]);
          } else {
            return $.when(acc);
          }
        });

        return $.when(...accs);
      })
      .then((...nodes) => ({
        nodes,
        links
      }));
  }

  outgoingNodes (node, slice) {
    return this.neighborNodes(node, {
      outgoing: true,
      incoming: false,
      undirected: false
    }, slice);
  }

  outflowingNodes (node, slice) {
    return this.neighborNodes(node, {
      outgoing: true,
      incoming: false,
      undirected: true
    }, slice);
  }

  incomingNodes (node, slice) {
    return this.neighborNodes(node, {
      outgoing: false,
      incoming: true,
      undirected: false
    }, slice);
  }

  inflowingNodes (node, slice) {
    return this.neighborNodes(node, {
      outgoing: false,
      incoming: true,
      undirected: true
    }, slice);
  }

  undirectedNodes (node, slice) {
    return this.neighborNodes(node, {
      outgoing: false,
      incoming: false,
      undirected: true
    }, slice);
  }

  directedNodes (node, slice) {
    return this.neighborNodes(node, {
      outgoing: true,
      incoming: true,
      undirected: false
    }, slice);
  }

  createNode (data = {}) {
    return $.when(this.createNodeRaw(data))
      .then(x => this.addAccessor(x));
  }

  createLink (source, target, data = {}, undirected = false) {
    const getKey = blob => typeof blob === 'string' ? blob : blob.key();
    source = getKey(source);
    target = getKey(target);

    return $.when(this.createLinkRaw(source, target, data, undirected))
      .then(x => this.addAccessor(x));
  }

  destroyNode (node) {
    const key = node.key();
    return this.destroyNodeRaw(key)
      .then(response => ({
        key,
        response
      }));
  }

  destroyLink (link) {
    const key = link.key();
    return this.destroyLinkRaw(key)
      .then(response => ({
        key,
        response
      }));
  }

  findNodesRaw () {
    throw new Error('To call findNodes(), findNode(), or findNodeByKey(), you must implement findNodesRaw()');
  }

  findLinksRaw () {
    throw new Error('To call findLinks(), findLink(), or findLinkByKey(), you must implement findLinksRaw()');
  }

  neighborLinksRaw (node, {outgoing, incoming, undirected}, offset, limit) {
    let reqs = [];

    if (outgoing) {
      reqs.push(this.findLinksRaw({}, node.key(), null, true, 0, null));
    }

    if (incoming) {
      reqs.push(this.findLinksRaw({}, null, node.key(), true, 0, null));
    }

    if (undirected) {
      reqs.push(this.findLinksRaw({}, node.key(), null, false, 0, null));
      reqs.push(this.findLinksRaw({}, null, node.key(), false, 0, null));
    }

    return $.when(...reqs)
      .then((...results) => concat(...results));
  }

  createNodeRaw () {
    throw new Error('To call createNode() you must implement createNodeRaw()');
  }

  destroyNodeRaw () {
    throw new Error('To call destroyNode() you must implement destroyNodeRaw()');
  }

  createLinkRaw () {
    throw new Error('To call createLink() you must implement createLinkRaw()');
  }

  destroyLinkRaw () {
    throw new Error('To call destroyLink() you must implement destroyLinkRaw()');
  }
}

export class NodeLinkList extends Adapter {
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
