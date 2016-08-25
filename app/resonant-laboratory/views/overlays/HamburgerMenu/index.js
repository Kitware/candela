import Menu from '../Menu';

let HamburgerMenu = Menu.extend({
  initialize: function () {
    let items = [
      {
        text: () => {
          if (window.mainPage.project) {
            return window.mainPage.project.get('name') + ' settings...';
          } else {
            return 'No project open';
          }
        },
        onclick: () => {
          window.mainPage.overlay.render('ProjectSettings');
        }
      },
      {
        text: 'Close project',
        onclick: () => {
          window.mainPage.switchProject(null).then(() => {
            window.mainPage.overlay.render('StartingScreen');
          });
        }
      },
      null
    ];

    if (window.mainPage.currentUser.isLoggedIn()) {
      items.push({
        text: 'Log Out ' +
          window.mainPage.currentUser.get('firstName') + ' ' +
          window.mainPage.currentUser.get('lastName'),
        onclick: () => {
          window.mainPage.currentUser.authenticate(false)
            .then(() => {
              window.mainPage.overlay.render('StartingScreen');
            });
        }
      });
    } else {
      items.push({
        text: 'Log In',
        onclick: () => {
          window.mainPage.overlay.render('LoginView');
        }
      });
    }

    Menu.prototype.initialize.apply(this, [{
      targetElement: null,
      items
    }]);
  },
  positionMenu: function () {
    // The hamburger menu is always fixed in the top corner
    this.$el.find('.menu').css({
      'top': '3em',
      'right': '0em'
    });
  }
});

export default HamburgerMenu;
