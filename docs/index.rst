===============
    Candela
===============

Candela is an `open-source suite <https://github.com/Kitware/candela>`_ of interoperable web visualization components
for `Kitware <http://www.kitware.com>`_'s `Resonant
<http://resonant.kitware.com>`_ platform. Candela focuses on making scalable,
rich visualizations available with a normalized API for use in real-world data
science applications. Integrated components include:

* :ref:`lineup_comp` component: `LineUp <http://www.caleydo.org/tools/lineup/>`_ dynamic ranking by the
  Harvard University `Visual Computing Group`_ and the `Caleydo`_ project.

* :ref:`upset_comp` component: `UpSet <http://www.caleydo.org/tools/upset/>`_ set visualization by the
  Harvard University `Visual Computing Group`_ and the `Caleydo`_ project.

* :ref:`onset_comp` component: `OnSet <http://www.cc.gatech.edu/gvu/ii/setvis/>`_ set visualization by the
  Georgia Institute of Technology `Information Interfaces Group
  <http://www.cc.gatech.edu/gvu/ii/>`_.

* `Vega <https://vega.github.io/vega/>`_ visualizations by the University of
  Washington `Interactive Data Lab <http://idl.cs.washington.edu/>`_. Example
  component: :ref:`scatterplot`.

* `GeoJS <https://geojs.readthedocs.io>`_ geospatial visualizations by `Kitware
  <http://www.kitware.com>`_'s `Resonant <http://resonant.kitware.com>`_
  platform. Example component: :ref:`geodots`.

.. _Visual Computing Group: http://vcg.seas.harvard.edu/

.. _Caleydo: http://www.caleydo.org/

.. _quickstart:

Getting started
===============

Quick start - JavaScript
------------------------

1. Enter the following in a text file named ``index.html``:

   .. literalinclude:: static/index.html
      :language: html
      :linenos:

2. Open ``index.html`` in your browser to display the resulting visualization.

Quick start - Python
--------------------

1. Make sure you have Python 2.7 and pip installed (on Linux and OS X systems,
   your local package manager should do the trick; for Windows, see `here
   <http://docs.python-guide.org/en/latest/starting/install/win/>`_).

2. Open a shell (e.g. Terminal on OS X; Bash on Linux; or Command Prompt on
   Windows) and issue this command to install the Candela package and the
   Requests library for obtaining sample data from the web: ::

    pip install pycandela requests

   (On UNIX systems you may need to do this as root, or with ``sudo``.)

3. Issue this command to start Jupyter notebook server in your browser: ::

    jupyter-notebook

4. Create a notebook from the New menu and enter the following in a cell,
   followed by Shift-Enter to execute the cell and display the visualization: ::

    import requests
    data = requests.get(
        'https://raw.githubusercontent.com/vega/vega-datasets/gh-pages/data/iris.json'
    ).json()

    import pycandela
    pycandela.components.ScatterPlot(
        data=data, color='species', x='sepalLength', y='sepalWidth')

Quick start - R
---------------

1. Download and install `RStudio <https://www.rstudio.com/>`_.

2. Run the following commands to install Candela: ::

    install.packages('devtools')
    devtools::install_github('Kitware/candela', subdir='R/candela')

3. Issue these commands to display a scatter plot of the ``mtcars`` dataset: ::

    library(candela)
    candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')

.. _here: http://docs.python-guide.org/en/latest/starting/install/win/

.. toctree::
    :maxdepth: 2
    :caption: Using Candela

    installation
    versioning

.. _components_list:

.. toctree::
    :maxdepth: 1
    :caption: Components

    components/barchart
    components/boxplot
    components/bulletchart
    components/ganttchart
    components/geo
    components/geodots
    components/heatmap
    components/histogram
    components/linechart
    components/lineup
    components/onset
    components/scatterplot
    components/scatterplotmatrix
    components/sententree
    components/similaritygraph
    components/survivalplot
    components/treeheatmap
    components/upset

.. toctree::
    :maxdepth: 2
    :caption: API documentation

    candela-js
    candela-py
    candela-r

.. toctree::
    :maxdepth: 2
    :caption: Developer documentation

    coding-style-guide
    releasing-candela
    testing
    vega-templates
