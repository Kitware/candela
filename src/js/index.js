window.onload = function () {
  (function (reconspect) {
    var el = document.getElementById("raw"),
      vis,
      data;

    data = [
      {
        text: "one, two",
        color: "blue"
      },

      {
        text: "buckle my shoe",
        color: "green"
      }
    ];

    vis = new reconspect.Dummy();
    vis.construct(el, data);

    window.setTimeout(function () {
      data[0] = {
        color: "red",
        text: "three, four"
      };

      data[1] = {
        color: "chartreuse",
        text: "open the door"
      };

      vis.refresh(data);
    }, 1000);
  }(window.reconspect));
}
