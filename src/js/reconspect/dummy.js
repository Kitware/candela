(function (reconspect, d3) {
  reconspect.Dummy = function () {
    return new reconspect.Visualization({
      construct: function (div, data) {
        var d = d3.select(this.div);

        d = d.append('ul');
        if (data) {
          this.refresh(data);
        }
      },

      refresh: function (data) {
        var d;

        d = d3.select(this.div)
          .select('ul')
          .selectAll('li')
          .data(data);

        d.enter()
          .append('li');

        d.text(function (d) {
          return d.text;
        })
        .style('color', function (d) {
          return d.color;
        });
      }
    });
  };
}(window.reconspect, window.d3));
