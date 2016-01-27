(function () {
  var reconspect = window.reconspect = {};

  reconspect.Visualization = function (spec) {
    var obj = {
      construct: function (div, data) {
        if (!spec.construct) {
          throw new Error('"construct()" must be specified');
        }

        this.div = div;

        spec.construct.call(this, div, data);
      },

      refresh: function (data) {
        if (!spec.refresh) {
          throw new Error('"refresh()" must be specified');
        }

        spec.refresh.call(this, data);
      }
    };

    for (var i in spec) {
      if (i !== 'construct' && i !== 'refresh' && spec.hasOwnProperty(i)) {
        obj[i] = spec[i];
      }
    }

    return obj;
  };
}());
