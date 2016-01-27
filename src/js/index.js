window.onload = function () {
  (function (reconspect) {
    var el = document.getElementById("raw"),
      vis;

    vis = new reconspect.Dummy();
    vis.construct(el, [
      {
        text: "one, two",
        color: "blue"
      },

      {
        text: "buckle my shoe",
        color: "green"
      }
    ]);
  }(window.reconspect));
}
