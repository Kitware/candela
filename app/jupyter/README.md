# Candela in Jupyter

To start a Jupyter environment that supports Candela, navigate to this directory
from a Candela git checkout, then perform:

```
pip install jupyter
jupyter-notebook
```

Within a notebook, run the following cells:

```python
import pycandela
pycandela.init()
```

```python
import json
data = json.load(open('../examples/data/iris.json'))
```

```python
pycandela.component('ScatterMatrix', {
    'data': data,
    'color': 'species',
    'fields': ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth']
})
```
