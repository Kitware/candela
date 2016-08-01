// Page-wide Styles
import svgFilters from './stylesheets/svgFilters.html';
import './stylesheets/colors.scss';
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/mainPage.scss';
import './stylesheets/girderPatches.css';

import Backbone from 'backbone';
import d3 from 'd3';
import { Set } from './shims/SetOps.js';

import Router from './Router';
import User from './models/User';
import Project from './models/Project';

import Header from './views/layout/Header';
import WidgetPanels from './views/layout/WidgetPanels';
import Overlay from './views/layout/Overlay';
import HelpLayer from './views/layout/HelpLayer';
import NotificationLayer from './views/layout/NotificationLayer';

// The API root is different
window.girder.apiRoot = 'api/v1';

// Our main view that coordinates each big chunk
let MainPage = Backbone.View.extend({
  initialize: function () {
    // Get the current app version
    this.versionNumber = new Promise((resolve, reject) => {
      window.girder.restRequest({
        path: 'system/resonantLaboratoryVersion',
        type: 'GET',
        error: reject
      }).done(resolve).error(reject);
    });

    // Set up navigation
    this.router = new Router();

    // Initial empty state (assume no logged in user)
    this.currentUser = new User();

    this.listenTo(this.currentUser, 'rlab:logout', () => {
      this.switchProject(null).then(() => {
        this.overlay.render('StartingScreen');
      });
    });

    // Start no datasets and no project
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
  fixColor: function (color) {
    // TODO: This function should be unnecessary; it patches
    // Chrome's attempt to interpret the first character
    // in a CSSRule's color hex string as a unicode character code
    // (see this issue):
    // https://bugs.chromium.org/p/chromium/issues/detail?id=633300
    return color.replace(/\\(\d\d)\s*/, (fullMatch, charMatch) => {
      return String.fromCharCode(parseInt(charMatch, 16));
    });
  },
  generateFilters: function () {
    let svg = d3.select('#SvgFilters');
    svg.html(svgFilters);

    // Discover the color scheme
    this.colorScheme = {};
    let allColors = new Set();
    Array.from(document.styleSheets).some(sheet => {
      if (sheet.cssRules) {
        return Array.from(sheet.cssRules).some(rule => {
          if (rule.cssText.startsWith('#ColorScheme')) {
            // Crazy regex magic that extracts
            // --prop: #color
            // from the CSS text (it doesn't actually replace anything)
            rule.cssText.replace(/(?:--)([^:]+):\s*(#[^;]+);/g,
              (fullMatch, prop, color) => {
                color = this.fixColor(color);
                this.colorScheme[prop] = color;
                allColors.add(color);
              });
          }
        });
      }
    });

    // Generate SVG filters that can recolor images to whatever
    // color we need. Styles simply do something like
    // filter: url(#recolorImageToFFFFFF)
    let recolorFilters = svg.select('defs').selectAll('filter.recolor')
      .data(Array.from(allColors), d => d);
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
    return this.project.create()
      .then(() => {
        this.trigger('rl:createProject');
        this.project.fetch().then(() => {
          this.trigger('rl:changeProject');
        });
      }).catch((err) => {
        this.switchProject(null);
        this.trigger('rl:error', err);
      });
  },
  switchProject: function (id) {
    if (this.project) {
      this.project.stopListening();
    }
    if (id === null) {
      this.project = null;
      this.trigger('rl:changeProject');
      return new Promise(() => {});
    } else {
      this.project = new Project({
        _id: id
      });

      return this.project.fetch().then(() => {
        this.trigger('rl:changeProject');
      }).catch((err) => {
        this.switchProject(null);
        this.trigger('rl:error', err);
      });
    }
  }
});

window.mainPage = new MainPage();

// Initialize the rendered chunks of the page
window.mainPage.render();

// Now that everything is set up, tell the router
// to apply the information it was given
window.mainPage.router.applyInitialRoute();
