import IPython.core.displaypub as displaypub
import json


def publish_display_data(data):
    try:
        displaypub.publish_display_data('pycandela', data)
    except TypeError:
        displaypub.publish_display_data(data)


def component(name, options):
    js = ("""
require(['candela'], function (candela) {
    new candela.components['%s'](element.get(0), %s)
});
""" % (name, json.dumps(options)))

    publish_display_data({'application/javascript': js})


def init():
    js = """
require.config({
    paths: {
        candela: 'http://kitware.github.io/candela/candela-0.2.0-2a0302fd'
    }
});

require(['candela'], function (candela) {
    if (candela) {
        element.append('<div>Candela loaded successfully.</div>');
    } else {
        element.append('<div>Error loading Candela.</div>');
    }
});
"""

    publish_display_data({'application/javascript': js})
