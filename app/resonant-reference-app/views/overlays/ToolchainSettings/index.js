import Underscore from 'underscore';
import Backbone from 'backbone';
import ToolchainLibrary from '../ToolchainLibrary';
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
  PublicUser: 'Others can see this toolchain in your Public folder',
  PrivateUser: 'This toolchain is private',
  PublicLibrary: 'This is a toolchain in our library of examples',
  PublicScratch: 'Others can see and edit this toolchain'
};

function toggleCallback() {
  if (this.value === window.mainPage.toolchain.status.location) {
    // Don't do anything if the user isn't actually changing
    // the toolchain's location
    return;
  }
  /*
    Toggle whether the toolchain is public or private
    
    If the user doesn't have write access to the toolchain
    (e.g. it's a library toolchain or the user is logged out),
    they can still make a copy as long a they have read access
    (there should be some problems even showing this view if
    they don't have read access).
    
    In all of the above scenarios, the togglePublic endpoint
    is smart enough to do the right thing (except we need to
    give it a hint if the user is copying a library toolchain
    directly to their public folder)
  */
  Promise.resolve(girder.restRequest({
    path: 'item/' + window.mainPage.toolchain.getId() + '/togglePublic',
    type: 'POST',
    data: {
      makePublic: this.value === 'PublicUser'
    }
  })).then(() => {
    window.mainPage.toolchain.updateStatus();
  }).catch((errorObj) => {
    window.mainPage.trigger('rra:error', errorObj);
  });
}

let ToolchainSettings = Backbone.View.extend({
  initialize: function () {
    this.listenTo(window.mainPage.toolchain, 'rra:changeStatus', this.render);
    this.listenTo(window.mainPage, 'rra:changeToolchain', this.handleNewToolchain);
  },
  handleNewToolchain: function () {
    if (window.mainPage.toolchain) {
      // Don't bother re-rendering this view until we have the new toolchain's
      // updated status
      this.listenTo(window.mainPage.toolchain, 'rra:changeStatus', this.render);
      this.listenTo(window.mainPage.toolchain, 'rra:rename', this.render);
    }
  },
  render: function () {
    if (!window.mainPage.toolchain) {
      // Ignore spurious render calls (there should always
      // be a toolchain to see this view)
      return;
    }

    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      this.library = new ToolchainLibrary({
        el: '#libraryChunk',
        keepOpenOnSelect: true
      });

      // Wire up simple events that don't change
      this.$el.find('#copyLinkButton').on('click', () => {
        window.copyTextToClipboard(window.location.href);
      });

      this.$el.find('#girderButton').on('click', () => {
        window.mainPage.router.openToolchainInGirder();
      });

      this.$el.find('#saveAsButton').on('click', () => {
        window.mainPage.toolchain.makeCopy();
      });

      this.$el.find('a#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      this.$el.find('a#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.$el.find('input[name="toolchainVisibility"]').off('click');

      this.$el.find('#deleteButton').on('click', () => {
        window.mainPage.toolchain.destroy()
          .then(() => {
            window.mainPage.switchToolchain(null);
          })
          .catch((errorObj) => {
            if (errorObj.statusText === 'Unauthorized') {
              if (window.mainPage.currentUser.isLoggedIn()) {
                window.mainPage.overlay.renderErrorScreen('You don\'t ' +
                  'have the necessary permissions to delete that toolchain.');
              } else {
                window.mainPage.overlay.renderErrorScreen('Sorry, you can\'t ' +
                  'delete toolchains unless you log in.');
              }
            } else {
              // Something else happened
              window.mainPage.trigger('rra:error', errorObj);
            }
          });
      });

      this.$el.find('#newButton').on('click', () => {
        window.mainPage.newToolchain();
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
    this.$el.find('#toolchainNameField')
      .val(window.mainPage.toolchain.get('name'));
    this.$el.find('#toolchainNameField').on('keyup',
      Underscore.debounce(function () {
        // this refers to the DOM element
        window.mainPage.toolchain.rename(this.value);
      }, 300));

    let status = window.mainPage.toolchain.status;

    if (status.editable) {
      this.$el.find('#editabilityIcon')
        .attr('src', canEditIcon);
      this.$el.find('#editabilityLabel')
        .text('You can edit this toolchain');
    } else {
      this.$el.find('#editabilityIcon')
        .attr('src', cantEditIcon);
      this.$el.find('#editabilityLabel')
        .text('You can\'t edit this toolchain');
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
    this.$el.find('input[name="toolchainVisibility"][value="' + status.location + '"]')
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

export default ToolchainSettings;
