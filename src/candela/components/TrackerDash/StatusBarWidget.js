import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';

import statusBarWidget from './templates/statusBarWidget.jade';
import VisComponent from '../../VisComponent';

class StatusBarWidget extends VisComponent {
  constructor (el, settings) {
    super(el);
    this.$el = $(this.el);

    this.numSuccess = settings.numSuccess || 0;
    this.numBad = settings.numBad || 0;
    this.numFail = settings.numFail || 0;
    this.numIncomplete = settings.numIncomplete || 0;
    $(window).on('resize', _.bind(this.createChart, this));
  }

  createChart () {
    const total = this.numSuccess + this.numBad + this.numFail + this.numIncomplete;
    if (total <= 0) {
      return;
    }

    const svg = d3.select('.status-bar-chart svg');
    svg.html('');
    const curWidth = svg.style('width').slice(0, -2);
    const unitWidth = curWidth / total;
    const badStart = unitWidth * this.numSuccess;
    const failStart = badStart + unitWidth * this.numBad;
    const incompleteStart = failStart + unitWidth * this.numFail;

    const successGroup = svg.append('g');
    successGroup.append('rect')
      .attr('x', 0)
      .attr('width', unitWidth * this.numSuccess)
      .attr('height', '100%')
      .attr('class', 'success');

    const badGroup = svg.append('g');
    badGroup.append('rect')
      .attr('x', badStart)
      .attr('width', unitWidth * this.numBad)
      .attr('height', '100%')
      .attr('class', 'bad');

    const failGroup = svg.append('g');
    failGroup.append('rect')
      .attr('x', failStart)
      .attr('width', unitWidth * this.numFail)
      .attr('height', '100%')
      .attr('class', 'fail');

    const incompleteGroup = svg.append('g');
    incompleteGroup.append('rect')
      .attr('x', incompleteStart)
      .attr('width', unitWidth * this.numIncomplete)
      .attr('height', '100%')
      .attr('class', 'incomplete');
  }

  render () {
    this.$el.html(statusBarWidget());
    this.createChart();
  }
}

export default StatusBarWidget;
