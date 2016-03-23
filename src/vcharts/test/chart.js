var assert = require('assert'),
  vcharts = require('../src/index.js');

describe('chart', function () {
  describe('basic', function () {

    it('should set width and height based on el properties', function () {
      var c,
        padding = {top: 10, left: 20, bottom: 30, right: 40};

      vcharts.templates.test = {
        width: ['@get', 'width', 100],
        height: ['@get', 'height', 200],
        padding: padding
      };

      c = vcharts.chart('test', {
        el: {offsetWidth: 0, offsetHeight: 0}
      });
      assert.deepEqual({
          width: 100,
          height: 200,
          padding: padding
        }, c.spec);

      c = vcharts.chart('test', {
        el: {offsetWidth: 300, offsetHeight: 400}
      });
      assert.deepEqual({
          width: (300 - 20 - 40),
          height: (400 - 10 - 30),
          padding: padding
        }, c.spec);
    });
  });

  describe('vega', function () {
    it('should produce vega spec', function () {
      var c = vcharts.chart('vega', {
        el: {},
        spec: {marks: []}
      });
      assert.deepEqual(vcharts.templates.vega, c.template);
      assert.deepEqual({marks: []}, c.spec);
    });
  });

  describe('update', function () {
    it('should update options', function () {
      var c = vcharts.chart('vega', {
        el: {},
        spec: {marks: [1]}
      });
      assert.deepEqual(vcharts.templates.vega, c.template);
      assert.deepEqual({el: {}, spec: {marks: [1]}}, c.options);
      c.update({spec: {marks: [1, 2, 3]}});
      assert.deepEqual({el: {}, spec: {marks: [1, 2, 3]}}, c.options);
    });
  });
});
