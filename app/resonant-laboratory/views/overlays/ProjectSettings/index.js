import Underscore from 'underscore';
import SettingsPanel from '../SettingsPanel';
import myTemplate from './template.html';
import canEditIcon from '../../../images/canEdit.svg';
import cantEditIcon from '../../../images/cantEdit.svg';
import privateIcon from '../../../images/private.svg';
import publicIcon from '../../../images/public.svg';
import libraryIcon from '../../../images/library.svg';
import scratchIcon from '../../../images/scratchSpace.svg';
import '../../../shims/copyToClipboard.js';
import './style.scss';

let visibilityIcons = {
  PublicUser: publicIcon,
  PrivateUser: privateIcon,
  PublicLibrary: libraryIcon,
  PublicScratch: scratchIcon
};
let visibilityLabels = {
  PublicUser: 'Others can see this project',
  PrivateUser: 'This project is private',
  PublicLibrary: 'This is a project in our library of examples',
  PublicScratch: 'Others can see and edit this project'
};

let ProjectSettings = SettingsPanel.extend({
  initialize: function () {
    SettingsPanel.prototype.initialize.apply(this, arguments);
    this.listenTo(window.mainPage, 'rl:changeProject', () => {
      this.attachProjectListeners();
      this.render();
    });
    this.attachProjectListeners();
  },
  getSideMenu: function () {
    return [
      {
        title: 'Project Settings',
        rootPanel: 'ProjectSettings',
        items: [
          {
            text: 'Save a copy',
            onclick: () => {
              window.mainPage.project.create();
            },
            enabled: () => {
              return !!window.mainPage.project;
            }
          },
          {
            text: 'Delete',
            onclick: () => {
              window.mainPage.project.destroy()
                .then(() => {
                  window.mainPage.switchProject(null);
                })
                .catch((errorObj) => {
                  if (errorObj.statusText === 'Unauthorized') {
                    if (window.mainPage.currentUser.isLoggedIn()) {
                      window.mainPage.overlay.renderErrorScreen(`You don\'t
      have the necessary permissions to delete that project.`);
                    } else {
                      window.mainPage.overlay.renderErrorScreen(`Sorry, you
      can\'t delete projects unless you log in.`);
                    }
                  } else {
                    // Something else happened
                    window.mainPage.trigger('rl:error', errorObj);
                  }
                });
            },
            enabled: () => {
              return window.mainPage.project &&
                window.mainPage.project.status.editable &&
                window.mainPage.currentUser.isLoggedIn();
            }
          },
          {
            text: 'New empty project',
            onclick: () => {
              window.mainPage.newProject().then(() => {
                window.mainPage.overlay.closeOverlay();
                window.mainPage.widgetPanels.closeWidgets();
              });
            }
          },
          {
            text: () => {
              return window.mainPage.project ? 'Open a different project' : 'Open a project';
            },
            onclick: () => {
              window.mainPage.overlay.render('ProjectLibrary');
            }
          },
          {
            text: 'Copy a link to the project',
            onclick: () => {
              this.copyLink();
            },
            enabled: () => {
              return !!window.mainPage.project;
            }
          }
        ]
      }
      /*
      TODO: when we support multiple datasets/visualizations,
      we should probably show options to add/remove them here
      {
        title: 'Datasets',
        items: []
      },
      {
        title: 'Visualizations',
        items: []
      } */
    ];
  },
  attachProjectListeners: function () {
    if (window.mainPage.project) {
      // Don't bother re-rendering this view until we have the new project's
      // updated status
      this.listenTo(window.mainPage.project, 'rl:changeStatus', () => {
        this.render();
      });
      this.listenTo(window.mainPage.project, 'rl:rename', () => {
        this.render();
      });
    }
  },
  updateBlurb: function () {
    if (!window.mainPage.project) {
      this.blurb = 'No project loaded.';
    } else {
      this.blurb = `A project connects datasets to visualizations.
 If a project is public, you can share it simply with its URL.
 Only users with access will be able to see it.`;
    }
  },
  attachSettingsListeners: function () {
    this.$el.find('#copyLinkIcon').on('click', () => {
      this.copyLink();
    });

    this.$el.find('#projectNameField').on('keyup',
      Underscore.debounce(function () {
        // this refers to the DOM element
        window.mainPage.project.rename(this.value);
      }, 300));

    this.$el.find('#publicVisibility, #privateVisibility')
      .on('change', function () {
        // this refers to the DOM element
        if (this.value === window.mainPage.project.status.visibility) {
          // Don't do anything if the user isn't actually changing the
          // project's location
          return;
        }
        /*
          The togglePublic endpoint is smart enough to do the right thing
          (except we need to give it a hint if the user is copying a library
          project directly to their public folder)
        */
        window.mainPage.project.restRequest({
          path: 'anonymousAccess/togglePublic',
          type: 'POST',
          data: {
            makePublic: this.value === 'PublicUser'
          }
        }).then(() => {
          window.mainPage.project.fetch();
        });
      });
  },
  updateSettings: function () {
    // Update the dialog with the latest info
    let status = window.mainPage.project.status;
    this.$el.find('#projectNameField')
      .val(window.mainPage.project.get('name'));

    this.$el.find('#projectLocation')
      .text(status.path)
      .attr('href', 'girder#item/' + window.mainPage.project.getId());

    if (status.editable) {
      this.$el.find('#editabilityIcon')
        .attr('src', canEditIcon)
        .attr('title', 'You can edit this project');
    } else {
      this.$el.find('#editabilityIcon')
        .attr('src', cantEditIcon)
        .attr('title', 'You can\'t edit this project');
    }

    this.$el.find('#visibilityIcon')
      .attr('src', visibilityIcons[status.visibility])
      .attr('title', visibilityLabels[status.visibility]);

    this.$el.find('input[name="projectVisibility"][value="' + status.visibility + '"]')
      .prop('checked', true);
    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#scratchVisibility, #libraryVisibility')
        .prop('disabled', true);
      this.$el.find('#publicVisibility, #privateVisibility')
        .prop('disabled', '');
    } else {
      this.$el.find('#scratchVisibility, #publicVisibility, #privateVisibility, #libraryVisibility')
        .prop('disabled', true);
    }
  },
  render: function () {
    this.updateBlurb();

    SettingsPanel.prototype.render.apply(this, arguments);

    if (!window.mainPage.project) {
      // Clear out the template; the blurb will suffice
      this.addedSubTemplate = false;
      this.$el.find('#subclassContent').html('');
    } else {
      if (!this.addedSubTemplate) {
        this.$el.find('#subclassContent').html(myTemplate);
        this.addedSubTemplate = true;

        // Only attach event listeners once
        this.attachSettingsListeners();
      }

      this.updateSettings();
    }
  },
  copyLink: function () {
    if (window.copyTextToClipboard(window.location.href)) {
      window.mainPage.notificationLayer.displayNotification(
        'Link successfully copied to clipboard');
    } else {
      window.mainPage.notificationLayer.displayNotification(
        'Sorry, couldn\'t copy the link for some reason.' +
        ' Try copying this page\'s URL from your browser\'s' +
        ' address bar instead.', 'error');
    }
  }
});

export default ProjectSettings;
