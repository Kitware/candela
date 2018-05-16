from functools import partial
from IPython.display import display, publish_display_data
import json
from pandas import DataFrame

try:
    __IPYTHON__
except NameError:
    raise ImportError('pycandela must be imported from IPython')

MIME_TYPE = 'application/vnd.candela+json'

_component_list = []

_require_config = """
    if (!window.__pycandela_config) {
        require.config({
            paths: {
                candela: 'https://unpkg.com/@candela/all/dist/candela-all'

                // To test unreleased candela: comment above, uncomment below,
                // and start jupyter-notebook from base of candela checkout.

                // candela: '/files/candela/packages/all/dist/candela-all'
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

    publish_display_data({
        'application/javascript': init_js,
        MIME_TYPE: None
    })


class DataFrameEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, DataFrame):
            return obj.to_dict(orient='records')
        return json.JSONEncoder.default(self, obj)


class Component(object):
    def __init__(self, name, **kwargs):
        self.name = name
        self.options = kwargs

    def to_json(self):
        return json.dumps({
            'name': self.name,
            'options': self.options
        }, cls=DataFrameEncoder)

    def _ipython_display_(self):
        serialized = self.to_json()
        js = ("""
            var render = function () {
                %s
                var c = %s;
                require(['candela'], function (candela) {
                    var comp = candela.components[c.name];
                    var vis = new comp(element.get(0), c.options);
                    vis.render();
                });
            };
            render();
            """ % (_require_config, serialized))

        publish_display_data({
            'application/javascript': js,
            MIME_TYPE: json.loads(serialized)
        })

    def save(self, filename):
        with open(filename, 'w') as f:
            f.write(self.to_json())

    def display(self):
        display(self)

def load(filename):
    with open(filename) as f:
        c = json.load(f)
    return Component(c['name'], **c['options'])

class ComponentAccessor(object):
    def __dir__(self):
        return _component_list

    def __getattr__(self, name):
        return partial(Component, name)


components = ComponentAccessor()

init()
