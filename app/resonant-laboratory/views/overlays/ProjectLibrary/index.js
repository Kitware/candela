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

let ProjectLibrary = Backbone.View.extend({
  initialize: function (params) {
    this.keepOpenOnSelect = params.keepOpenOnSelect === true;

    this.listenTo(window.mainPage.currentUser, 'rl:updateLibrary', this.render);
    this.listenTo(window.mainPage.currentUser, 'rl:updateLibrary', this.render);

    // The ProjectLibrary is part of other views that may or
    // may not expect a project to be open right now...
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.handleNewProject);
    this.handleNewProject();

    this.addedTemplate = false;
  },
  handleNewProject: function () {
    if (window.mainPage.project) {
      // Don't bother re-rendering this view until we have the new project's
      // updated status
      this.listenTo(window.mainPage.project, 'rl:changeStatus', this.render);
      this.listenTo(window.mainPage.project, 'rl:rename', this.render);
    } else {
      this.render();
    }
  },
  render: Underscore.debounce(function () {
    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      jQuery('#girderLink').on('click', () => {
        window.mainPage.router.openUserDirectoriesInGirder();
      });

      jQuery('#loginLink2').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      jQuery('#registerLink2').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.addedTemplate = true;
    }

    // Start off with every section hidden
    jQuery('.hideable').hide();

    // Get the set of projects in the public library
    new Promise((resolve, reject) => {
      girder.restRequest({
        path: 'resource/lookup?path=/collection/ResonantLaboratory/Projects',
        type: 'GET',
        error: reject
      }).done(resolve).error(reject);
    }).then(folder => {
      this.getFolderContents(folder, 'projectLibrary', libraryFileIcon);
    }).catch(() => {
    }); // fail silently

    if (window.mainPage.currentUser.isLoggedIn()) {
      // The user is logged in

      // Get the set of the user's private projects
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'folder/privateFolder',
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }).then(folder => {
        this.getFolderContents(folder, 'privateProjects', privateFileIcon);
      }).catch(() => {
      }); // fail silently

      // Get the set of the user's public projects
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'folder/publicFolder',
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }).then(folder => {
        this.getFolderContents(folder, 'publicProjects', publicFileIcon);
      }).catch(() => {
      }); // fail silently
    } else {
      // The user is logged out
      let ids = window.localStorage.getItem('scratchProjects');

      if (ids !== null) {
        // Get the set of projects in the public scratch space
        // that this browser created
        Promise.resolve(girder.restRequest({
          path: 'item/validateScratchItems',
          data: {
            ids: ids
          },
          type: 'GET',
          error: null
        })).then(items => {
          this.renderProjects(new girder.collections.ItemCollection(items),
            'scratchProjects', scratchFileIcon);
        }).catch(() => {
        }); // fail silently
      }
    }
  }, 300),
  getFolderContents: function (folder, divId, icon) {
    let projects = new girder.collections.ItemCollection();
    projects.altUrl = 'item';
    projects.pageLimit = 100;
    projects.fetch({
      folderId: folder._id
    });
    projects.on('reset', (items) => {
      this.renderProjects(items, divId, icon);
    });
  },
  renderProjects: function (items, divId, icon) {
    let projectModels = items.models.filter(d => {
      if (!d.attributes || !d.attributes.meta) {
        return false;
      }
      return d.attributes.meta.datasets &&
      d.attributes.meta.matchings &&
      d.attributes.meta.visualizations;
    });

    if (projectModels.length > 0) {
      jQuery('#' + divId).show();
      jQuery('#' + divId + 'Divider').show();
      jQuery('#' + divId + 'Header').show();
      jQuery('#' + divId + 'Explanation').show();
    }

    let libraryButtons = d3.select('#' + divId)
      .selectAll('.circleButton')
      .data(projectModels, d => {
        return d.id + d.name();
      });

    let libraryButtonsEnter = libraryButtons.enter().append('div');
    libraryButtons.exit().remove();
    libraryButtons.attr('class', (d) => {
      if (window.mainPage.project &&
        d.id === window.mainPage.project.getId()) {
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
      .text(d => d.name());

    d3.select('#' + divId).selectAll('.circleButton')
      .on('click', d => {
        window.mainPage.switchProject(d.id);
        if (!this.keepOpenOnSelect) {
          window.mainPage.overlay.closeOverlay();
        }
      });
  }
});

export default ProjectLibrary;
