import Backbone from 'backbone';
import d3 from 'd3';

import Router from './Router';
import User from './models/User';
import Project from './models/Project';

import Header from './views/layout/Header';
import WidgetPanels from './views/layout/WidgetPanels';
import Overlay from './views/layout/Overlay';
import HelpLayer from './views/layout/HelpLayer';
import NotificationLayer from './views/layout/NotificationLayer';

// Page-wide Styles
import colorScheme from '!!sass-variable-loader!./stylesheets/colors.scss';
import svgFilters from './stylesheets/svgFilters.html';
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/mainPage.scss';
import './stylesheets/girderPatches.scss';

// The API root is different
let girder = window.girder;
girder.apiRoot = 'api/v1';

// Our main view that coordinates each big chunk
let MainPage = Backbone.View.extend({
  initialize: function () {
    // Get the current app version
    this.versionNumber = this.girderRequest({
      path: 'system/resonantLaboratoryVersion',
      type: 'GET'
    });

    // Set up navigation
    this.router = new Router();

    // Initial empty state (assume no logged in user)
    this.currentUser = new User();
    // Attempt to log in (async result)
    this.currentUser.authenticate(true, this);

    this.listenTo(this.currentUser, 'rlab:logout', () => {
      this.switchProject(null).then(() => {
        this.overlay.render('StartingScreen');
      });
    });

    // Start with no datasets and no project
    this.loadedDatasets = {};
    this.project = null;

    // Respond to resize events
    window.onresize = () => {
      this.render();
      this.trigger('rl:resizeWindow');
    };
  },
  render: function () {
    /*
      Because each of the big chunks of the page
      refer directly to window.mainPage, we don't
      actually add them until we call render()
    */
    if (!this.addedPageChunks) {
      this.generateFilters();
      this.header = new Header({
        el: '#Header'
      });
      this.widgetPanels = new WidgetPanels({
        el: '#WidgetPanels'
      });
      this.overlay = new Overlay({
        el: '#Overlay'
      });
      this.helpLayer = new HelpLayer({
        el: '#HelpLayer'
      });
      this.notificationLayer = new NotificationLayer({
        el: '#NotificationLayer'
      });
      this.router.addListeners();
      this.currentUser.addListeners();
      this.header.addListeners();
      this.addedPageChunks = true;
    }

    this.header.render();
    this.widgetPanels.render();
    this.overlay.render();
    this.helpLayer.render();
    this.notificationLayer.render();
  },
  generateFilters: function () {
    let svg = d3.select('#SvgFilters');
    svg.html(svgFilters);

    // Collect all colors in use
    this.allColors = {};
    Object.keys(colorScheme).forEach(colorName => {
      let color = colorScheme[colorName];
      if (!(color in this.allColors)) {
        this.allColors[color] = [];
      }
      this.allColors[color].push(colorName);
    });

    // Generate SVG filters that can recolor images to whatever
    // color we need. Styles simply do something like
    // filter: url(#recolorImageToFFFFFF)
    let recolorFilters = svg.select('defs').selectAll('filter.recolor')
      .data(Object.keys(this.allColors), d => d);
    let recolorFiltersEnter = recolorFilters.enter().append('filter')
      .attr('class', 'recolor')
      .attr('id', d => 'recolorImageTo' + d.slice(1));
    let cmpTransferEnter = recolorFiltersEnter.append('feComponentTransfer')
      .attr('in', 'SourceAlpha')
      .attr('result', 'color');
    cmpTransferEnter.append('feFuncR')
      .attr('type', 'linear')
      .attr('slope', 0)
      .attr('intercept', d => {
        let hexvalue = d.slice(1, 3);
        return Math.pow(parseInt(hexvalue, 16) / 255, 2);
      });
    cmpTransferEnter.append('feFuncG')
      .attr('type', 'linear')
      .attr('slope', 0)
      .attr('intercept', d => {
        let hexvalue = d.slice(3, 5);
        return Math.pow(parseInt(hexvalue, 16) / 255, 2);
      });
    cmpTransferEnter.append('feFuncB')
      .attr('type', 'linear')
      .attr('slope', 0)
      .attr('intercept', d => {
        let hexvalue = d.slice(5, 7);
        return Math.pow(parseInt(hexvalue, 16) / 255, 2);
      });
  },
  newProject: function () {
    this.project = new Project();
    let responsePromise = this.project.create()
      .then(() => {
        // We want to return the actual project object, not the fetched result
        // from the server
        return this.project;
      });
    responsePromise.then(() => {
      this.trigger('rl:createProject');
      this.trigger('rl:changeProject');
    }).catch(err => {
      this.trigger('rl:error', err);
    });
    return responsePromise;
  },
  switchProject: function (id) {
    if (this.project) {
      this.project.stopListening();
    }
    let responsePromise;
    if (id === null) {
      this.project = null;
      responsePromise = Promise.resolve(null);
    } else {
      this.project = new Project({
        _id: id
      });

      responsePromise = this.project.fetch()
        .then(() => {
          // We want to return the actual project object, not the fetched result
          // from the server
          return this.project;
        });
    }
    responsePromise.then(() => {
      this.trigger('rl:changeProject');
    }).catch((err) => {
      this.trigger('rl:error', err);
    });
    return responsePromise;
  },
  getProject: function () {
    if (this.project) {
      return Promise.resolve(this.project);
    } else {
      return this.newProject();
    }
  },
  girderRequest: function (params) {
    let responsePromise = new Promise((resolve, reject) => {
      params.error = reject;
      return girder.restRequest(params).done(resolve).error(reject);
    });
    return responsePromise;
  }
});

window.mainPage = new MainPage();

// Initialize the rendered chunks of the page
window.mainPage.render();

// Now that everything is set up, tell the router
// to apply the information it was given
window.mainPage.router.applyInitialRoute();
