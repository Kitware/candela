window.HTMLWidgets.widget({
  name: 'candela',
  type: 'output',
  factory: function (el, width, height) {
    var visualization;

    return {
      renderValue: function (x) {
        var render = function () {
          if (window.candela) {
            visualization = new window.candela.components[x.name](el, x.options);
            visualization.render();
          } else {
            window.setTimeout(render, 100);
          }
        };
        render();
      },
      resize: function (width, height) {
        visualization.render();
      }
    };
  }
});
