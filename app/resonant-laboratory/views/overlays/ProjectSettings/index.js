import Underscore from 'underscore';
import Backbone from 'backbone';
import ProjectLibrary from '../ProjectLibrary';
import myTemplate from './template.html';
import canEditIcon from '../../../images/canEdit.svg';
import cantEditIcon from '../../../images/cantEdit.svg';
import privateIcon from '../../../images/private.svg';
import publicIcon from '../../../images/public.svg';
import libraryIcon from '../../../images/library.svg';
import scratchIcon from '../../../images/scratchSpace.svg';
import '../../../shims/copyToClipboard.js';
import './style.css';

let girder = window.girder;

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

function toggleCallback () {
  if (this.value === window.mainPage.project.status.location) {
    // Don't do anything if the user isn't actually changing
    // the project's location
    return;
  }
  /*
    Toggle whether the project is public or private

    If the user doesn't have write access to the project
    (e.g. it's a library project or the user is logged out),
    they can still make a copy as long a they have read access
    (there should be some problems even showing this view if
    they don't have read access).

    In all of the above scenarios, the togglePublic endpoint
    is smart enough to do the right thing (except we need to
    give it a hint if the user is copying a library project
    directly to their public folder)
  */
  new Promise((resolve, reject) => {
    girder.restRequest({
      path: 'item/' + window.mainPage.project.getId() + '/anonymousAccess/togglePublic',
      type: 'POST',
      data: {
        makePublic: this.value === 'PublicUser'
      },
      error: reject
    }).done(resolve).error(reject);
  }).then(() => {
    window.mainPage.project.updateStatus();
  }).catch((errorObj) => {
    window.mainPage.trigger('rl:error', errorObj);
  });
}

let ProjectSettings = Backbone.View.extend({
  initialize: function () {
    this.listenTo(window.mainPage.project, 'rl:changeStatus', this.render);
    this.listenTo(window.mainPage, 'rl:changeProject', this.handleNewProject);
  },
  handleNewProject: function () {
    if (window.mainPage.project) {
      // Don't bother re-rendering this view until we have the new project's
      // updated status
      this.listenTo(window.mainPage.project, 'rl:changeStatus', this.render);
      this.listenTo(window.mainPage.project, 'rl:rename', this.render);
    }
  },
  render: function () {
    if (!window.mainPage.project) {
      // Ignore spurious render calls (there should always
      // be a project to see this view)
      return;
    }

    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      this.library = new ProjectLibrary({
        el: '#libraryChunk',
        keepOpenOnSelect: true
      });

      // Wire up simple events that don't change
      this.$el.find('#copyLinkButton').on('click', () => {
        if (window.copyTextToClipboard(window.location.href)) {
          window.mainPage.notificationLayer.displayNotification(
            'Link successfully copied to clipboard');
        } else {
          window.mainPage.notificationLayer.displayNotification(
            'Sorry, couldn\'t copy the link for some reason.' +
            ' Try copying this page\'s URL from your browser\'s' +
            ' address bar instead.', 'error');
        }
      });

      this.$el.find('#girderButton').on('click', () => {
        window.mainPage.router.openProjectInGirder();
      });

      this.$el.find('#saveAsButton').on('click', () => {
        window.mainPage.project.makeCopy();
      });

      this.$el.find('a#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      this.$el.find('a#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.$el.find('input[name="projectVisibility"]').off('click');

      this.$el.find('#deleteButton').on('click', () => {
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
      });

      this.$el.find('#newButton').on('click', () => {
        window.mainPage.newProject().then(() => {
          window.mainPage.overlay.closeOverlay();
          window.mainPage.widgetPanels.closeWidgets();
        });
      });

      this.addedTemplate = true;
    }

    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#loginLinks').hide();
    } else {
      this.$el.find('#loginLinks').show();
    }

    this.library.render();

    // Set up the settings part of the dialog
    this.$el.find('#projectNameField')
      .val(window.mainPage.project.get('name'));
    this.$el.find('#projectNameField').on('keyup',
      Underscore.debounce(function () {
        // this refers to the DOM element
        window.mainPage.project.rename(this.value);
      }, 300));

    let status = window.mainPage.project.status;

    if (status.editable) {
      this.$el.find('#editabilityIcon')
        .attr('src', canEditIcon);
      this.$el.find('#editabilityLabel')
        .text('You can edit this project');
    } else {
      this.$el.find('#editabilityIcon')
        .attr('src', cantEditIcon);
      this.$el.find('#editabilityLabel')
        .text("You can't edit this project");
    }

    if (status.editable && window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#deleteButton').prop('disabled', '');
    } else {
      this.$el.find('#deleteButton').prop('disabled', true);
    }

    this.$el.find('#visibilityIcon')
      .attr('src', visibilityIcons[status.location]);
    this.$el.find('#visibilityLabel')
      .text(visibilityLabels[status.location]);
    this.$el.find('input[name="projectVisibility"][value="' + status.location + '"]')
      .prop('checked', true);
    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#scratchVisibility, #libraryVisibility')
        .prop('disabled', true);
      this.$el.find('#publicVisibility, #privateVisibility')
        .prop('disabled', '')
        .on('click', toggleCallback);
    } else {
      this.$el.find('#scratchVisibility')
        .prop('disabled', '')
        .on('click', toggleCallback);
      this.$el.find('#publicVisibility, #privateVisibility, #libraryVisibility')
        .prop('disabled', true);
    }
  }
});

export default ProjectSettings;
