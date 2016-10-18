from functools import partial
from IPython.display import display, publish_display_data
import json
from pandas import DataFrame

try:
    __IPYTHON__
except NameError:
    raise ImportError('pycandela must be imported from IPython')

_component_list = []

_require_config = """
    if (!window.__pycandela_config) {
        require.config({
            paths: {
                candela: 'https://unpkg.com/candela/dist/candela'
            },
            urlArgs: null
        });
        window.__pycandela_config = true;
    }
"""


def init():
    init_js = _require_config + """
    require(['candela'], function (candela) {
        var components = [];
        for (var comp in candela.components) {
            if (candela.components.hasOwnProperty(comp)) {
                components.push(comp);
            }
        }
        var kernel = IPython.notebook.kernel;
        kernel.execute('import pycandela as __pycandela');
        kernel.execute('__pycandela._component_list = ' +
            JSON.stringify(components));
    }, function (error) {
        element.append('<pre>' + error + '</pre>');
    });
    """

    publish_display_data({'application/javascript': init_js})


class DataFrameEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, DataFrame):
            return obj.to_dict(orient='records')
        return json.JSONEncoder.default(self, obj)


class Component(object):
    def __init__(self, name, **kwargs):
        self.name = name
        self.options = kwargs

    def _ipython_display_(self):
        js = ("""
            var render = function () {
                %s
                require(['candela'], function (candela) {
                    var comp = candela.components['%s'];
                    var vis = new comp(element.get(0), %s);
                    vis.render();
                });
            };
            render();
            """ % (_require_config, self.name,
                   json.dumps(self.options, cls=DataFrameEncoder)))

        publish_display_data({'application/javascript': js})

    def display(self):
        display(self)


class ComponentAccessor(object):
    def __dir__(self):
        return _component_list

    def __getattr__(self, name):
        return partial(Component, name)

components = ComponentAccessor()

init()
