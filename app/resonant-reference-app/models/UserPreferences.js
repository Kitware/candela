import MetadataItem from './MetadataItem';

let UserPreferences = MetadataItem.extend({
  /*
    resetToDefaults doesn't work unless defaults
    is a function. If defaults are a simple object,
    changes to the model mutate the defaults object.
  */
  defaults: () => {
    return {
      name: 'rra_preferences',
      description: `
Contains your preferences for the Reference application. If
you move or delete this item, your preferences will be lost.`,
      meta: {
        leftWidgets: [],
        rightWidgets: [],
        leftIcons: [],
        rightIcons: [],
        // currentToolchain is either undefined,
        // or is an item ID
        currentToolchain: undefined,
        achievements: {}
      }
    };
  },
  resetToDefaults: function () {
    let self = this;
    // The user has logged out, or some other authentication
    // problem is going on. This sets the app to the initial
    // empty state as if no one is logged in
    self.clear({
      silent: true
    });
    self.set(self.defaults);
  },
  levelUp: function (achievement) {
    let self = this;
    let achievements = self.getMeta('achievements');
    if (achievements[achievement] !== true) {
      achievements[achievement] = true;
      self.setMeta('achievements', achievements);
      self.save();
      self.trigger('rra:levelUp');
    }
  },
  closeWidget: function (widgetName) {
    let self = this;
    // Remove widgetName from the list of widgets that this
    // user last had open (save the new configuration)
    let widgetList = self.getMeta('leftWidgets');
    let index = widgetList.indexOf(widgetName);
    if (index !== -1) {
      widgetList.splice(index, 1);
      self.setMeta('leftWidgets', widgetList);
      self.save();
    }
    widgetList = self.getMeta('rightWidgets');
    index = widgetList.indexOf(widgetName);
    if (index !== -1) {
      widgetList.splice(index, 1);
      self.setMeta('rightWidgets', widgetList);
      self.save();
    }
  },
  openWidget: function (widgetName) {
    let self = this;

    // Figure out where the widget should go;
    // it should match the order and side of the icons
    let side = 'left';
    let iconList = self.getMeta('leftIcons');
    if (iconList.indexOf(widgetName) === -1) {
      side = 'right';
      iconList = self.getMeta('rightIcons');
      if (iconList.indexOf(widgetName) === -1) {
        throw new Error(`Attempted to open a widget that
          isn't on the toolbar: ` + widgetName);
      }
    }

    let widgetList = self.getMeta(side + 'Widgets');
    if (widgetList.indexOf(widgetName) !== -1) {
      // The widget is already open
      return;
    }

    // TODO: probably a more efficient way to do this...
    widgetList.push(widgetName);
    widgetList.sort((a, b) => {
      return iconList.indexOf(a) - iconList.indexOf(b);
    });

    self.setMeta(side + 'Widgets', widgetList);
    self.save();
  }
});

export default UserPreferences;
