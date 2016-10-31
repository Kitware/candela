import d3 from 'node/d3';
import SettingsPanel from '../SettingsPanel';
import ProjectSettings from '../ProjectSettings';
import myTemplate from './template.html';
import libraryFileIcon from '../../../images/light/library.svg';
import privateFileIcon from '../../../images/light/file_private.svg';
import publicFileIcon from '../../../images/light/file_public.svg';
import scratchFileIcon from '../../../images/light/file_scratch.svg';
import warningIcon from '../../../images/warning.svg';
let girder = window.girder;

let ProjectLibrary = ProjectSettings.extend({
  initialize: function () {
    ProjectSettings.prototype.initialize.apply(this, arguments);
    this.listenTo(window.mainPage.currentUser, 'rl:updateLibrary', () => {
      this.render();
    });
  },
  getSideMenu: function () {
    let sideMenu = ProjectSettings.prototype.getSideMenu.apply(this, arguments);
    // Highlight the the menu item from ProjectSettings
    sideMenu[0].items[3].focused = true;
    sideMenu[0].items[3].onclick = () => {
      window.mainPage.overlay.render('ProjectSettings');
    };
    return sideMenu;
  },
  render: function () {
    ProjectSettings.prototype.updateBlurb.apply(this, []);
    // We use our own subtemplate, so only call
    // the grandparent superclass render function
    SettingsPanel.prototype.render.apply(this, arguments);
    if (!this.addedSubTemplate) {
      this.$el.find('#subclassContent').html(myTemplate);

      this.$el.find('#girderLink').on('click', () => {
        window.mainPage.router.openUserDirectoriesInGirder();
      });

      this.$el.find('#loginLink2').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      this.$el.find('#registerLink2').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.addedSubTemplate = true;
    }

    // Start off with every section hidden
    this.$el.find('.hideable').hide();

    // Get the set of projects in the public library
    window.mainPage.girderRequest({
      path: 'resource/lookup?path=/collection/Resonant Lab Library/Projects',
      type: 'GET'
    }).then(folder => {
      this.getFolderContents(folder, 'projectLibrary', libraryFileIcon);
    }).catch(() => {
    }); // fail silently

    if (window.mainPage.currentUser.isLoggedIn()) {
      // The user is logged in

      // Get the set of the user's private projects
      window.mainPage.girderRequest({
        path: 'folder/anonymousAccess/privateFolder',
        type: 'GET'
      }).then(folder => {
        this.getFolderContents(folder, 'privateProjects', privateFileIcon);
      }).catch(() => {
      }); // fail silently

      // Get the set of the user's public projects
      window.mainPage.girderRequest({
        path: 'folder/anonymousAccess/publicFolder',
        type: 'GET'
      }).then(folder => {
        this.getFolderContents(folder, 'publicProjects', publicFileIcon);
      }).catch(() => {
        // fail silently
      });
    } else {
      // The user is logged out
      let ids = window.localStorage.getItem('scratchProjects');

      if (ids !== null) {
        // Get the set of projects in the public scratch space
        // that this browser created
        window.mainPage.girderRequest({
          path: 'item/anonymousAccess/validateScratchItems',
          data: {
            ids: ids
          },
          type: 'GET'
        }).then(items => {
          // items may be a subset of the projects that we asked for
          // (a registered user - likely us - may have adopted our old
          // project, or the project could have been deleted... that's
          // the risk you run when you leave stuff in the public scratch
          // space)
          window.mainPage.currentUser.preferences.updateScratchProjects(items);

          // Show the set of items to the user
          this.renderProjects(new girder.collections.ItemCollection(items),
            'scratchProjects', scratchFileIcon);
        });
      }
    }
  },
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
      let meta = d.get('meta');
      return meta && meta.rlab && meta.rlab.itemType && meta.rlab.itemType === 'project';
    });

    if (projectModels.length > 0) {
      this.$el.find('#' + divId + 'Section').show();
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

    libraryButtonsEnter.append('img')
      .attr('class', 'projectGlyph');
    libraryButtons.select('img.projectGlyph')
      .attr('src', icon);

    libraryButtonsEnter.append('img')
      .attr('class', 'badge')
      .style('display', 'none');
    window.mainPage.versionNumber.then(appVersion => {
      libraryButtons.select('img.badge')
        .attr('src', warningIcon)
        .style('display', d => {
          if (d.attributes.meta.rlab.versionNumber === appVersion) {
            return 'none';
          } else {
            return 'none';
          }
        })
        .attr('title', d => {
          return 'This project was created with version ' + d.attributes.meta.rlab.versionNumber +
            ' of Resonant Lab.\nYou are currently using version ' + appVersion;
        });
    });

    libraryButtonsEnter.append('span');
    libraryButtons.select('span')
      .text(d => d.name());

    d3.select('#' + divId).selectAll('.circleButton')
      .on('click', d => {
        window.mainPage.switchProject(d.id);
        window.mainPage.overlay.closeOverlay();
      });
  }
});

export default ProjectLibrary;
