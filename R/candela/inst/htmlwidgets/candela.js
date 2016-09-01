HTMLWidgets.widget({
  name: 'candela',
  type: 'output',
  factory: function (el, width, height) {
    // TODO: define shared variables for this instance
    var visualization;

    return {
      renderValue: function (x) {
        console.log(JSON.stringify(x));
        visualization = new window.candela.components[x.name](el, x.options);
        visualization.render();
      },
      resize: function (width, height) {
        // TODO: code to re-render the widget with a new size
      }
    };
  }
});
