import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import jQuery from 'jquery';

// Modal overlay views
import HamburgerMenu from '../../overlays/HamburgerMenu';
import LoginView from '../../overlays/LoginView';
import RegisterView from '../../overlays/RegisterView';
import ResetPasswordView from '../../overlays/ResetPasswordView';
import AchievementLibrary from '../../overlays/AchievementLibrary';
import StartingScreen from '../../overlays/StartingScreen';
import DatasetLibrary from '../../overlays/DatasetLibrary';
import DatasetSettings from '../../overlays/DatasetSettings';
import VisualizationLibrary from '../../overlays/VisualizationLibrary';
import ProjectSettings from '../../overlays/ProjectSettings';
import AboutResonantLab from '../../overlays/AboutResonantLab';

import reallyBadErrorTemplate from './reallyBadErrorTemplate.html';
import errorTemplate from './errorTemplate.html';
import userErrorTemplate from './userErrorTemplate.html';
import successTemplate from './successTemplate.html';
import loadingTemplate from './loadingTemplate.html';

import alertTemplate from './alertTemplate.html';
import confirmTemplate from './confirmTemplate.html';

let VIEWS = {
  HamburgerMenu,
  LoginView,
  ResetPasswordView,
  RegisterView,
  AchievementLibrary,
  ProjectSettings,
  StartingScreen,
  DatasetLibrary,
  DatasetSettings,
  VisualizationLibrary,
  AboutResonantLab
};

import './style.scss';

let Overlay = Backbone.View.extend({
  initialize: function () {
    this.template = undefined;
    this.view = null;

    this.listenTo(window.mainPage, 'rl:changeProject',
      this.handleChangeProject);
    this.listenTo(window.mainPage, 'rl:error',
      this.handleError);
  },
  handleChangeProject: function () {
    if (window.mainPage.project === null) {
      // No project is loaded; show the StartingScreen
      this.render('StartingScreen');
    }
    // Otherwise, we just stay as we are (either no
    // overlay, or the overlay that just changed stuff
    // is responsible for picking the appropriate next
    // view)
  },
  extractErrorDetails: function (errorObj) {
    if (errorObj.status === 401) {
      // Authentication failures simply mean that the user is logged out;
      // we can ignore these
      return;
    }
    // Some other server error has occurred...
    let details = '';
    if (errorObj.status) {
      details += 'Status: ' + errorObj.status + '\n\n';
    }
    if (errorObj.stack) {
      details += 'Stack Trace:\n' + errorObj.stack + '\n\n';
    }
    if (errorObj.responseJSON && errorObj.responseJSON.trace) {
      details += 'Stack Trace:';
      errorObj.responseJSON.trace.forEach(traceDetails => {
        details += '\n' + traceDetails[0];
        details += '\n' + traceDetails[1] + '\t' + traceDetails[2];
        details += '\n' + traceDetails[3] + '\n';
      });
      details += '\n';
    }
    return details;
  },
  handleError: function (errorObj) {
    let message;

    // Sometimes errors are wrapped in arrays...
    if (errorObj instanceof Array && errorObj.length) {
      errorObj = errorObj[0];
    }

    if (errorObj.responseJSON && errorObj.responseJSON.message) {
      message = errorObj.responseJSON.message;
    } else if (errorObj.message) {
      message = errorObj.message;
    } else {
      // Fallback if I can't tell what it is
      message = 'Unknown error; maybe the console contains some clues';
      console.warn('Unknown error! Here\'s what I was given:', arguments);
    }
    // Let the user know something funky is up
    this.renderReallyBadErrorScreen(message, this.extractErrorDetails(errorObj));

    // Actually throw the error if it's a real one
    if (errorObj instanceof Error) {
      throw errorObj;
    }
  },
  getScreen: function (template, message, details) {
    let options = {
      message: message,
      details: details || '',
      bugReportLink: 'https://github.com/Kitware/candela/issues',
      consultingLink: 'http://www.kitware.com/company/contact_kitware.php'
    };
    return Underscore.template(template)(options);
  },
  renderLoadingScreen: function (message) {
    this.render(this.getScreen(loadingTemplate, message), false, () => {
      this.$el.find('#okButton').on('click', this.closeOverlay);
    });
  },
  renderErrorScreen: function (message) {
    this.render(this.getScreen(errorTemplate, message), false,
      () => {
        this.$el.find('#okButton').on('click', () => {
          window.mainPage.switchProject(null)
            .then(() => {
              window.mainPage.overlay.render('StartingScreen');
            });
        });
      });
  },
  renderUserErrorScreen: function (message) {
    this.render(this.getScreen(userErrorTemplate, message), false, () => {
      this.$el.find('#okButton').on('click', this.closeOverlay);
    });
  },
  renderReallyBadErrorScreen: function (message, details) {
    this.render(this.getScreen(reallyBadErrorTemplate, message, details), false,
      () => {
        this.$el.find('#okButton').on('click', () => {
          window.mainPage.switchProject(null)
            .then(() => {
              window.mainPage.overlay.render('StartingScreen');
            });
        });
      });
  },
  renderSuccessScreen: function (message) {
    this.render(this.getScreen(successTemplate, message), false, () => {
      this.$el.find('#okButton').on('click', this.closeOverlay);
    });
  },
  alertDialog: function (message) {
    this.render(this.getScreen(alertTemplate, message), false, () => {
      this.$el.find('#okButton').on('click', this.closeOverlay);
    });
  },
  confirmDialog: function (message) {
    let forceResolve, forceReject;

    let waiter = new Promise((resolve, reject) => {
      forceResolve = resolve;
      forceReject = reject;
    });

    this.render(this.getScreen(confirmTemplate, message), false, () => {
      this.$el.find('#okButton').on('click', () => {
        this.closeOverlay();
        forceResolve();
      });
      this.$el.find('#cancelButton').on('click', () => {
        this.closeOverlay();
        forceReject();
      });
    });

    return waiter;
  },
  closeOverlay: function () {
    // If we don't have a project, jump straight to the
    // opening overlay (don't actually close)
    if (window.mainPage.project) {
      window.mainPage.overlay.render(null);
    } else {
      window.mainPage.overlay.render('StartingScreen');
    }
  },
  addCloseListeners: function () {
    // Add a bunch of ways to close out of the overlay

    // Close button:
    this.$el.find('#closeOverlay')
      .off('click.closeOverlay')
      .on('click.closeOverlay', () => {
        this.closeOverlay();
      });

    // Clicking on the area outside the overlay:
    let self = this;
    this.$el.off('click.closeOverlay')
      .on('click.closeOverlay', function (event) {
        // this refers to the DOM element
        if (event.target !== this) {
          return;
        } else {
          self.closeOverlay();
        }
      });

    // Hitting the escape key:
    jQuery(window).off('keyup.closeOverlay')
      .on('keyup.closeOverlay', e => {
        if (e.keyCode === 27) {
          this.closeOverlay();
        }
      });
  },
  removeCloseListeners: function () {
    // Remove the ways to close out of the overlay
    // (both when the overlay is hidden, and when
    // one shows up that can't be closed)
    this.$el.find('#closeOverlay').off('click.closeOverlay');
    this.$el.off('click.closeOverlay');
    jQuery(window).off('keyup.closeOverlay');
  },
  render: Underscore.debounce(function (template, nofade, callback) {
    // Don't fade if we're just switching between overlays
    nofade = nofade || (template !== null && this.template !== null);

    if (template !== undefined && this.template !== template) {
      // Remove any backbone event listeners on the previous
      // view if they existing (without this, views can
      // hang out in memory and reassert themselves
      // when they should be destroyed)
      if (this.view && this.view.stopListening) {
        this.view.stopListening();
      }

      // Because we're switching to a different overlay, save the setting
      // for the next time that we simply re-render
      this.template = template;

      if (template === null) {
        // Hide the overlay
        this.removeCloseListeners();

        // Fade out
        if (nofade !== true) {
          d3.select(this.el)
            .style('opacity', 1.0)
            .transition().duration(400)
            .style('opacity', 0.0);
          window.setTimeout(() => {
            d3.select(this.el)
              .style('display', 'none');
            this.$el.html('');
            this.view = null;
          }, 500);
        } else {
          d3.select(this.el)
            .style('display', 'none');
          this.$el.html('');
          this.view = null;
        }
      } else {
        this.$el.html('');

        // Before we draw the contents, start
        // the fade in process (if relevant)
        if (nofade !== true) {
          d3.select(this.el)
            .style('display', null)
            .style('opacity', 0.0)
            .transition().duration(400)
            .style('opacity', 1.0);
        } else {
          d3.select(this.el).style('opacity', 1.0);
        }

        if (template.prototype &&
          template.prototype instanceof Backbone.View) {
          // This is a View class already
          let Template = template;
          this.view = new Template();
          this.el.appendChild(this.view.el);
          this.view.render();
        } else if (template instanceof Backbone.View) {
          // This is a View instance already

          // TODO: we may need to let the instance know that it's being
          // shown again; if it was previously shown, it will have
          // lost all its event listeners when it was closed
          this.view = template;
          this.el.appendChild(this.view.el);
          this.view.render();
        } else if (VIEWS.hasOwnProperty(template)) {
          // This is a named template (the name of a view
          // in views/layout/overlays)
          this.view = new VIEWS[template]({
            // Some girder views expect a parent, but
            // in this app, we just run them headless
            parentView: null
          });
          this.el.appendChild(this.view.el);
          this.view.render();
        } else {
          // Okay, this is a dynamically-generated overlay
          // (probably a widget help/info screen)... so
          // the template string contains the actual contents
          this.view = null;
          this.$el.html(template);
        }

        if (this.$el.find('#closeOverlay').length !== 0) {
          // Does this view have a close button? If so,
          // attach the ways to close it
          this.addCloseListeners();
        } else {
          // If it doesn't, that means this is an
          // overlay where the user needs to do
          // something special (e.g. load a project)
          // in order to dismiss it
          this.removeCloseListeners();
        }
      }
      this.trigger('rl:changeOverlay');
    } else {
      // We're just re-rendering the view
      if (this.view !== null) {
        this.view.render();
        // It's possible that the view nuked
        // its closeOverlay listeners-if relevant,
        // reattach them
        if (this.$el.find('#closeOverlay').length !== 0) {
          this.addCloseListeners();
        }
      }
    }

    if (callback !== undefined) {
      callback();
    }
  }, 300)
});

Overlay.VIEWS = VIEWS;
export default Overlay;
