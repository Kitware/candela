import Menu from '../Menu';
import './style.css';

let HamburgerMenu = Menu.extend({
  initialize: function () {
    let items = [
      {
        text: window.mainPage.project.get('name') + ' settings...',
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
      null,
      {
        text: 'About Resonant Laboratory...',
        onclick: () => {
          window.mainPage.overlay.render('AboutResonantLab');
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
    // Do nothing; the position of the main
    // menu is set in our stylesheet
  }
});

export default HamburgerMenu;
