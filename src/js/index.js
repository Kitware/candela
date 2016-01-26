window.onload = function () {
  (function (reconspect) {
    var el = document.getElementById("raw");

    reconspect.dummy.construct(el, [
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
