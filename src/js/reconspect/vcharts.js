(function (reconspect, vcharts) {
  reconspect.LineChart = function () {
    return new reconspect.Visualization({
      construct: function (div, data) {
        var minY,
          maxY,
          spread,
          values;

        values = data.values.map(function (x) {
          return x[1];
        });

        minY = Math.min.apply(null, values);
        if (minY === -Infinity) {
          minY = 0;
        }

        maxY = Math.max.apply(null, values);
        if (maxY === Infinity) {
          maxY = 0;
        }

        spread = (maxY - minY) * 0.20;
        maxY += spread;

        this.chart = vcharts.chart('xy', {
          el: div,
          series: [
            {
              name: 'series1',
              values: data.values,
              x: '0',
              y: '1',
              color: 'blue',
              line: true,
              point: true
            }
          ],
          xAxis: {
            title: 'X',
            type: 'time'
          },
          yAxis: {
            title: 'Y',
            zoom: false,
            pan: false,
            domain: [minY, maxY]
          },
          padding: {
            top: 100,
            bottom: 100,
            left: 100,
            right: 100
          }
        });
      },

      refresh: function (data) {
        this.chart.update();
      }
    });
  };
}(window.reconspect, window.vcharts));
