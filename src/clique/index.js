import Adapter from './adapter/Adapter';
import NodeLinkList from './adapter/NodeLinkList';
import Graph from './model/Graph';
import Selection from './model/Selection';
import Cola from './view/Cola';
import SelectionInfo from './view/SelectionInfo';
import LinkInfo from './view/LinkInfo';

export default {
  adapter: {
    Adapter,
    NodeLinkList
  },

  model: {
    Graph,
    Selection
  },

  view: {
    Cola,
    SelectionInfo,
    LinkInfo
  }
};
