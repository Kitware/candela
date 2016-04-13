import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import libraryFileIcon from '../../../images/light/library.svg';
import privateFileIcon from '../../../images/light/file_private.svg';
import publicFileIcon from '../../../images/light/file_public.svg';
import scratchFileIcon from '../../../images/light/file_scratch.svg';
let girder = window.girder;

let ToolchainLibrary = Backbone.View.extend({
  initialize: function (params) {
    let self = this;
    self.keepOpenOnSelect = params.keepOpenOnSelect === true;
    
    self.listenTo(window.mainPage.currentUser, 'rra:updateLibrary', self.render);
    self.listenTo(window.mainPage.currentUser, 'rra:updateLibrary', self.render);
    
    // The ToolchainLibrary is part of other views that may or
    // may not expect a toolchain to be open right now...
    self.listenTo(window.mainPage, 'rra:changeToolchain',
      self.handleNewToolchain);
    self.handleNewToolchain();
  },
  handleNewToolchain: function () {
    let self = this;
    if (window.mainPage.toolchain) {
      // Don't bother re-rendering this view until we have the new toolchain's
      // updated status
      self.listenTo(window.mainPage.toolchain, 'rra:changeStatus', self.render);
      self.listenTo(window.mainPage.toolchain, 'rra:rename', self.render);
    } else {
      self.render();
    }
  },
  render: Underscore.debounce(function () {
    let self = this;

    if (!self.addedTemplate) {
      self.$el.html(myTemplate);
      
      jQuery('#girderLink').on('click', () => {
        window.mainPage.router.openUserDirectoriesInGirder();
      });
      
      jQuery('#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });
      
      jQuery('#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });
      
      self.addedTemplate = true;
    }

    // Start off with every section hidden
    jQuery('.hideable').hide();

    // Get the set of toolchains in the public library
    Promise.resolve(girder.restRequest({
      path: 'resource/lookup?path=/collection/ReferenceApp/Toolchains',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.getFolderContents(folder, 'toolchainLibrary', libraryFileIcon);
    }).catch(() => {});

    if (window.mainPage.currentUser.isLoggedIn()) {
      // The user is logged in

      // Get the set of the user's private toolchains
      Promise.resolve(girder.restRequest({
        path: 'folder/privateFolder',
        type: 'GET',
        error: null
      })).then(function (folder) {
        self.getFolderContents(folder, 'privateToolchains', privateFileIcon);
      }).catch(() => {});

      // Get the set of the user's public toolchains
      Promise.resolve(girder.restRequest({
        path: 'folder/publicFolder',
        type: 'GET',
        error: null
      })).then(function (folder) {
        self.getFolderContents(folder, 'publicToolchains', publicFileIcon);
      }).catch(() => {});
    } else {
      // The user is logged out
      let ids = window.localStorage.getItem('scratchToolchains');

      if (ids !== null) {
        // Get the set of toolchains in the public scratch space
        // that this browser created
        Promise.resolve(girder.restRequest({
          path: 'item/validateScratchItems',
          data: {
            ids: ids
          },
          type: 'GET',
          error: null
        })).then(function (items) {
          self.renderToolchains(new girder.collections.ItemCollection(items),
            'scratchToolchains', scratchFileIcon);
        }).catch(() => {});
      }
    }
  }, 300),
  getFolderContents: function (folder, divId, icon) {
    let self = this;
    let toolchains = new girder.collections.ItemCollection();
    toolchains.altUrl = 'item';
    toolchains.pageLimit = 100;
    toolchains.fetch({
      folderId: folder._id
    });
    toolchains.on('reset', (items) => {
      self.renderToolchains(items, divId, icon);
    });
  },
  renderToolchains: function (items, divId, icon) {
    let self = this;
    let toolchainModels = items.models.filter(function (d) {
      if (!d.attributes || !d.attributes.meta) {
        return false;
      }
      return d.attributes.meta.datasets &&
        d.attributes.meta.mappings &&
        d.attributes.meta.visualizations;
    });

    if (toolchainModels.length > 0) {
      jQuery('#' + divId).show();
      jQuery('#' + divId + 'Header').show();
      jQuery('#' + divId + 'Explanation').show();
    }

    let libraryButtons = d3.select('#' + divId)
      .selectAll('.circleButton')
      .data(toolchainModels, (d) => d.id + d.name());

    let libraryButtonsEnter = libraryButtons.enter().append('div');
    libraryButtons.exit().remove();
    libraryButtons.attr('class', (d) => {
      if (window.mainPage.toolchain &&
        d.id === window.mainPage.toolchain.getId()) {
        return 'current circleButton';
      } else {
        return 'circleButton';
      }
    });

    libraryButtonsEnter.append('img');
    libraryButtons.selectAll('img')
      .attr('src', icon);

    libraryButtonsEnter.append('span');
    libraryButtons.selectAll('span')
      .text(function (d) {
        return d.name();
      });

    d3.select('#' + divId).selectAll('.circleButton')
      .on('click', function (d) {
        window.mainPage.switchToolchain(d.id);
        if (!self.keepOpenOnSelect) {
          window.mainPage.overlay.render(null);
        }
      });
  }
});

export default ToolchainLibrary;
