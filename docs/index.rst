.. Candela documentation master file, created by
   sphinx-quickstart on Thu Apr 11 11:42:23 2013.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==============================================================================
 Candela
==============================================================================

Candela is

.. _quickstart:

Getting started
===============

Quick start - JavaScript
------------------------

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
    data = requests.get('https://raw.githubusercontent.com/vega/vega-datasets/gh-pages/data/iris.json').json()

    import pycandela
    pycandela.components.ScatterPlot(data=df, color='species', x='sepalLength', y='sepalWidth')

Quick start - R
---------------

Diving deeper
-------------

* To learn how to use Candela, see :ref:`iris` and the other
  :ref:`tutorials <tutorials>`.
* To learn how to create your own Candela components, see
  :ref:`developing-components`.

.. _here: http://docs.python-guide.org/en/latest/starting/install/win/

Using Candela
=============

.. toctree::
    :maxdepth: 2

    installation
    versioning

.. _tutorials:

Tutorials
=========

.. toctree::
    :maxdepth: 2

    tutorials/iris

The Candela API
===============

.. toctree::
    :maxdepth: 2

    candela-js
    candela-py
    candela-r

Candela components
==================

.. toctree::
    :maxdepth: 2

    components/scatterplot

Information for developers
==========================

.. toctree::
    :maxdepth: 2

    coding-style-guide
    releasing-candela
    developing-components

Indices and tables
==================

* :ref:`genindex`
* :ref:`search`
