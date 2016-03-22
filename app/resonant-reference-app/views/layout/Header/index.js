import d3 from 'd3';
import Backbone from 'backbone';
import myTemplate from './template.html';

import './header.css';

import libraryIcon from '../../../images/library.svg';
import mappingIcon from '../../../images/mapping.svg';
import scatterplotIcon from '../../../images/scatterplot.svg';

let Header = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    
    // TODO: the toolchain will have
    // many components from different sources...
    // get the appropriate icons from the toolchain
    let toolchainIcons = [libraryIcon, mappingIcon, scatterplotIcon];
    
    let icons = d3.select(self.el).select('#toolchainIcons')
      .selectAll('img').data(toolchainIcons);
    
    icons.enter().append('img')
      .attr('src', (d) => d)
      .attr('class', 'headerButton');
    // TODO: change the top bar based on
    // logged in status, etc
    
    // TODO: show menu on clicking
    // gear, allowing users to show/hide
    // specific tools
  }
});

export default Header;
