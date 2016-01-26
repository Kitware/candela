(function (reconspect, d3) {
  reconspect.dummy = {
    construct: function (div, data) {
      var d = d3.select(div);

      d = d.append('ul');
      d.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .text(function (d) {
          return d.text;
        })
        .style('color', function (d) {
          return d.color;
        });
    }
  };
}(window.reconspect, window.d3));
