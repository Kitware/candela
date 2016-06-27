import Underscore from 'underscore';
import d3 from 'd3';
import Widget from '../Widget';
import myTemplate from './template.html';
import './style.css';

let STATUS = {
  NO_DATA: 0,
  SUCCESS: 1,
  CANT_LOAD: 2,
  LOADING: 3,
  NO_ATTRIBUTES: 4
};

let DatasetView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);

    this.showTable = true;

    this.icons.splice(0, 0, {
      src: Widget.swapIcon,
      title: 'Click to select a different dataset',
      onclick: () => {
        window.mainPage.overlay.render('DatasetLibrary');
      }
    });

    this.status = STATUS.NO_DATA;
    this.icons.push({
      src: () => {
        if (this.status === STATUS.LOADING) {
          return Widget.spinnerIcon;
        } else if (this.status === STATUS.SUCCESS) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: () => {
        if (this.status === STATUS.LOADING) {
          return 'The dataset hasn\'t finished loading yet';
        } else if (this.status === STATUS.SUCCESS) {
          return 'The dataset appears to have loaded correctly';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: () => {
        this.renderHelpScreen();
      }
    });

    this.listenTo(window.mainPage, 'rl:changeProject',
      this.handleNewProject);
    this.handleNewProject();
  },
  handleNewProject: function () {
    this.listenTo(window.mainPage.project, 'rl:changeDatasets',
      this.render);

    this.render();
  },
  renderInfoScreen: function () {
    window.mainPage.helpLayer.showTips(this.getDefaultTips());
  },
  renderHelpScreen: function () {
    if (this.status === STATUS.NO_DATA) {
      window.mainPage.overlay.renderUserErrorScreen('You have not chosen a dataset yet. Click <a onclick="window.mainPage.overlay.render(\'DatasetLibrary\')">here</a> to choose one.');
    } else if (this.status === STATUS.SUCCESS) {
      window.mainPage.overlay.renderSuccessScreen('The dataset appears to have loaded correctly.');
    } else if (this.status === STATUS.CANT_LOAD) {
      window.mainPage.overlay.renderErrorScreen('The dataset could not be loaded; there is a good chance that there is a permissions problem.');
    } else if (this.status === STATUS.CANT_PARSE) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data; you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    } else if (this.status === STATUS.NO_ATTRIBUTES) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data. Specifically, we\'re having trouble understanding the dataset attributes (usually column headers); you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    }
  },
  renderEmptyState: function () {
    this.$el.find('#datasetOverview, #tablePreview, #histogramPreview').hide();
    this.$el.find('#emptyDatasetState').show();
  },
  renderOverview: function (datasetDetails) {
    let bounds = this.$el.find('#datasetOverview')[0].getBoundingClientRect();
    d3.select(this.el).select('svg')
      .attr({
        width: bounds.width,
        height: bounds.height
      });
    console.log(datasetDetails);
  },
  renderHistograms: function (datasetDetails) {
    this.$el.find('#emptyDatasetState, #tablePreview').hide();
    this.$el.find('#datasetOverview, #histogramPreview').show();
    this.renderOverview(datasetDetails);
    // TODO
  },
  renderTable: function (datasetDetails) {
    this.$el.find('#emptyDatasetState, #histogramPreview').hide();
    this.$el.find('#datasetOverview, #tablePreview').show();
    this.renderOverview(datasetDetails);
    // TODO
  },
  render: Underscore.debounce(function () {
    let widgetIsShowing = Widget.prototype.render.apply(this, arguments);

    if (!this.addedTemplate) {
      this.$el.html(myTemplate);
      this.addedTemplate = true;
    }

    // Get the dataset in the project (if there is one)
    // TODO: get the dataset assigned to this widget
    let datasetObj;
    if (window.mainPage.project) {
      let datasets = window.mainPage.project.getMeta('datasets');
      if (datasets && datasets.length > 0) {
        datasetObj = window.mainPage.loadedDatasets[datasets[0].dataset];
      }
    }

    if (!datasetObj) {
      this.renderEmptyState();
      this.status = STATUS.NO_DATA;
      this.statusText.text = 'No file loaded';
      this.renderIndicators();
    } else {
      this.status = STATUS.LOADING;
      this.statusText.text = 'Loading...';
      this.renderIndicators();

      Promise.all([datasetObj.cache.schema,
                   datasetObj.cache.overviewHistogram,
                   datasetObj.cache.filteredHistogram,
                   datasetObj.cache.pageHistogram,
                   datasetObj.cache.currentDataPage])
        .then(datasetDetails => {
          if (datasetDetails.indexOf(null) !== -1) {
            this.status = STATUS.CANT_LOAD;
            this.statusText.text = 'ERROR';
            this.renderIndicators();
          } else if (Object.keys(datasetDetails[0]).length === 0) {
            // The schema has no attributes...
            this.status = STATUS.NO_ATTRIBUTES;
            this.statusText.text = 'ERROR';
            this.renderIndicators();
          } else {
            this.status = STATUS.SUCCESS;
            this.statusText.text = datasetObj.get('name');
            this.renderIndicators();
            if (widgetIsShowing) {
              if (this.showTable) {
                this.renderTable(datasetDetails);
              } else {
                this.renderHistograms(datasetDetails);
              }
            }
          }
        });
    }
  }, 300)
});

export default DatasetView;
