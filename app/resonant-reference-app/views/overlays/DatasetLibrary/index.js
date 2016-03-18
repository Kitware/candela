import Backbone from 'backbone';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/library.svg';
let girder = window.girder;

let DatasetLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);

    girder.restRequest({
      path: 'api/v1/resource/lookup?path=/collection/ReferenceApp/Data',
      type: 'GET',
      error: null
    }).done(function (folder) {
      let datasets = new girder.collections.ItemCollection();
      datasets.altUrl = 'api/v1/item';
      datasets.pageLimit = 100;
      datasets.fetch({
        folderId: folder._id
      });
      
      datasets.on('reset', function (items) {
        let libraryButtons = d3.select('div.datasetLibrary')
          .selectAll('.circleButton')
          .data(items.models);

        let libraryButtonsEnter = libraryButtons.enter().append('div')
          .attr('class', 'circleButton');
        libraryButtons.exit().remove();

        libraryButtonsEnter.append('img');
        libraryButtons.selectAll('img')
          .attr('src', libImage);

        libraryButtonsEnter.append('span');
        libraryButtons.selectAll('span')
          .text(function (d) {
            return d.name();
          });

        d3.select('div.libraryInterface').selectAll('.circleButton')
          .on('click', function (d) {
            window.toolchain.setDataset(d);
            window.layout.overlay.render(null);
          });
      });
    });
  }
});

export default DatasetLibrary;
