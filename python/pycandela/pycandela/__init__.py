import IPython.core.displaypub as displaypub
import json
from pandas import DataFrame

class DataFrameEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, DataFrame):
            return obj.to_dict(orient='records')
        return json.JSONEncoder.default(self, obj)

def publish_display_data(data):
    try:
        displaypub.publish_display_data('pycandela', data)
    except TypeError:
        displaypub.publish_display_data(data)


def component(name, options):
    js = ("""
(function (el) {
    require(['candela'], function (candela) {
        var vis = new candela.components['%s'](el.get(0), %s);
        vis.render();
    });
})(element);
""" % (name, json.dumps(options, cls=DataFrameEncoder)))

    publish_display_data({'application/javascript': js})


def init():
    js = """
require.config({
    paths: {
        candela: 'http://kitware.github.io/candela/candela-0.2.0-81be44f6'
    }
});

(function (el) {
    require(['candela'], function (candela) {
        if (candela) {
            el.append('<div>Candela loaded successfully.</div>');
        } else {
            el.append('<div>Error loading Candela.</div>');
        }
    });
})(element);
"""

    publish_display_data({'application/javascript': js})
