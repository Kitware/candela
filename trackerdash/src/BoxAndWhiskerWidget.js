import Backbone from 'backbone';
import _ from 'underscore';
import d3 from 'd3';
import nv from 'nvd3';
import $ from 'jquery';

import colors from './colors.js';
import { failValue, warningValue,
         standardRound, computeColor } from './utility.js';

export let BoxAndWhiskerWidget = Backbone.View.extend({

  initialize: function (settings) {
    this.showScales = settings.showScales !== false;
    this.current = settings.result.current;
    this.trend = settings.trend;
    this.currentValues = this.current.sort(d3.ascending),
    this.median = d3.median(this.currentValues);
    this.outOfBounds = this.median <= 0 || this.median >= this.trend.max;
    $(window).resize(_.bind(this.render, this));
  },

  chartData: function () {},

  render: function () {

    const toolTipDiv = d3.select("body").append("div")
      .attr("class", "tdash-tooltip")
      .style("opacity", 0);

    let svg = d3.select('[id=\'' + this.el.id + '-svg\']')
     .html("")
     .attr("width", "100%")
     .attr("height", "100%");

    // An IQR factor for determining outliers is a good rule of thumb. See
    // https://en.wikipedia.org/wiki/Box_plot for further explanation.
    const iqrFactor = 1.5,
      min = 0,
      max = this.trend.max,
      margin = {top: 10, right: 20, bottom: 10, left: 10},
      w = svg[0][0].clientWidth - margin.left - margin.right,
      h = svg[0][0].clientHeight - margin.top - margin.bottom;

    svg.attr("style", "padding-left: " + margin.left + "; padding-right: " +
             margin.right);

    const q1 = d3.quantile(this.currentValues, 0.25);
    const q3 = d3.quantile(this.currentValues, 0.75);
    const iqr = q3 - q1;
    const outlierRange = iqr*iqrFactor;

    const x = d3.scale.linear()
      .domain([min, max])
      .range([0, w]);

    if (this.showScales) {
      const xAxis = d3.svg.axis()
        .tickSize(1)
        .ticks(5)
        .orient("bottom")
        .scale(x);
      svg.append("g")
        .attr("transform", "translate(0,30)")
        .call(xAxis);
    }

    if (this.outOfBounds) {
        svg.append("rect")
          .attr("x", -margin.left)
          .attr("width", w + margin.left + margin.right)
          .attr("height", h + margin.top + margin.bottom)
          .attr("stroke", colors.fail)
          .attr("stroke-width", 3)
          .attr("fill-opacity", 0);
    }

    const quantiles = [
      d3.quantile(this.currentValues, 0.05),
      d3.quantile(this.currentValues, 0.25),
      d3.quantile(this.currentValues, 0.50),
      d3.quantile(this.currentValues, 0.75),
      d3.quantile(this.currentValues, 0.95)
    ];

    const outliers = _.filter(this.currentValues, (val) => {
        return val < q1 - outlierRange || val > q3 + outlierRange;
    });

    // Setup tooltip
    svg.on("mouseover", (d) => {
        toolTipDiv.transition()
          .duration(200)
          .style("opacity", 1.0);
        let cells = [
          ['Min', standardRound(this.currentValues[0])],
          ['5th %ile', standardRound(quantiles[0])],
          ['25th %ile', standardRound(quantiles[1])],
          ['Median', standardRound(this.median)],
          ['75th %ile', standardRound(quantiles[3])],
          ['95th %ile', standardRound(quantiles[4])],
          ['Max', standardRound(this.currentValues[this.currentValues.length-1])],
          ['# of Samples', this.currentValues.length],
        ];
        if (outliers.length > 0) {
          // Add in a blank row to separate Outliers.
          cells.push(['&nbsp', '&nbsp']);
          cells.push(['Outliers', _.map(outliers, standardRound).join(", ")]);
        }
        let toolTipHtml = '<table style="border-collapse: separate; border-spacing: 10px 2px;">';
        _.each(cells, function (cell) {
          toolTipHtml += '<tr><td>'+cell[0]+'</td><td>'+cell[1]+'</td></tr>';
        });
        toolTipHtml += '</table>';
        toolTipDiv.html(toolTipHtml)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", (d) => {
        toolTipDiv.transition()
          .duration(200)
          .style("opacity", 0);
      });

    svg = svg.append("g");

    let vals = svg.selectAll("circle")
      .data(outliers)
      .enter()
      .append("circle")
      .on("mouseover", (d) => {
          toolTipDiv.transition()
            .duration(200)
            .style("opacity", .9);
          toolTipDiv.html("Outlier: " + d.toString())
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", (d) => {
        toolTipDiv.transition()
          .duration(200)
          .style("opacity", 0);
      });

    vals.attr("cx", (d, i) => {
      return (d/max)*w;
    }).attr("cy", h/2)
      .attr("r", 3)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", "white");

    const qtrGroup = svg.append("g");

    const qtr = qtrGroup.selectAll("rect")
      .data([{q1: q1, q3: q3}])
      .enter()
      .append("rect");

    qtr.attr("x", (d, i) => {
      return (d.q1/max)*w;
    })
     .attr("y", h/4)
     .attr("width", (d, i) => {
        return ((d.q3-d.q1)/max)*w;
      })
     .attr("height", h/2)
     .attr("fill", computeColor(this.trend, this.median))
     .attr("stroke", "black")
     .attr("stroke-width", 1)
     .attr("class", "qtr");

    // Draw the whisker marks
    const markGroup = svg.append("g");
    const marks = markGroup.selectAll("rect")
      .data([quantiles[0],
             quantiles[2],
             quantiles[4]])
      .enter()
      .append("rect");
    marks.attr("x", (d, i) => {
      return (d/max)*w;
    })
     .attr("y", h/4)
     .attr("width", 2)
     .attr("height", h/2);

    // Draw the horizontal lines that extend the whiskers
    const horGroup = svg.append("g");
    const hor = horGroup.selectAll("rect")
      .data([
        {start: quantiles[0], end: quantiles[1]},
        {start: quantiles[3], end: quantiles[4]}
      ])
      .enter()
      .append("rect");
    hor.attr("x", (d, i) => {
      return (d.start/max)*w;
    })
      .attr("y", h/2)
      .attr("height", 2)
      .attr("width", (d, i) => {
        return ((d.end-d.start)/max)*w;
      });

  }

});
