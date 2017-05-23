====================
    Installation
====================

There are two ways to install Candela: from standard package repositories systems such as
npm and the Python Package Index (PyPI).
Installing from a package repository is simpler, but limited to public release
versions; installing from source is slightly more complicated but allows you to
run cutting-edge development versions.

Installing from package management systems
==========================================

JavaScript
----------

To install the Candela JavaScript library to ``node_modules/candela`` in your
current directory, run: ::

    npm install candela

To install the Candela JavaScript library as a dependency of your web application
and add it to your ``package.json`` file, run: ::

    npm install --save candela

A self-contained JavaScript bundle for Candela will be found at
``node_modules/candela/dist/candela[.min].js``.

Using Webpack
~~~~~~~~~~~~~

If your project uses a Webpack build process, you can use Candela's bundled
Webpack helper function to include Candela easily in your project without having
to use the fullsize bundle file. The idea is to directly include Candela source
files as needed in your project, relying on the Webpack helper to arrange for
the proper loaders and other configuration options to be used. For example,
without Webpack, your source file might include lines like

.. code-block:: javascript

    var candela = require('candela/dist/candela.min.js');
    var ScatterPlot = candela.components.ScatterPlot;

This will result in your application loading the entire Candela bundle at
runtime, which may not be optimal if you just wish to use the ``ScaterPlot``
component. Instead, using Webpack, you could cast this code as follows:

.. code-block:: javascript

    var ScatterPlot = require('candela/components/ScatterPlot');

To make sure that your build process uses the correct loaders for this file, you
should make sure to use the Candela webpack helper function in your project's
Webpack configuration:

.. code-block:: javascript

    var candelaWebpack = require('candela/webpack');

    module.exports = candelaWebpack({
      // Your original webpack configuration goes here
    });

This approach lets you keep your code more concise and meaningful, while also
avoiding unnecessarily large application bundles.

Python
------

The latest release version of the Python bindings for Candela can always be found
in the `Python Package Index <http://pypi.python.org/pypi>`_.
The easiest way to install Candela is via Pip, a package manager for Python.

**1. Install software dependencies**

Install the following software:

* Python 2.7
* Pip

On Linux and OS X computers, your local package manager should be sufficient for
installing these.  On Windows, please consult this `guide
<http://docs.python-guide.org/en/latest/starting/install/win/>`_ for advice
about Python and Pip.

**2. Install the Candela Python package**

Use this command in a shell to install the Candela package and its dependencies: ::

    pip install pycandela

You may need to run this command as the superuser, using ``sudo`` or similar.

Building and installing from source
===================================

Before any of these source installations, you will need to issue this Git
command to clone the Candela repository: ::

    git clone git://github.com/Kitware/candela.git

This will create a directory  named ``candela`` containing the source code.  Use
``cd`` to move into this directory: ::

    cd candela


JavaScript
----------

Candela is developed on `GitHub <https://github.com/Kitware/candela>`_.  If you
wish to contribute code, or simply want the very latest development version, you
can download, build, and install from GitHub, following these steps:

**1. Install software dependencies**

To build Candela from source, you will need to install the following software:

* Git
* Node.js
* npm
* `cairo <https://cairographics.org/download/>`_ (``brew install cairo`` on macOS)

**2. Install Node dependencies**

Issue this command to install the necessary Node dependencies via the Node
Package Manager (NPM): ::

    npm install

The packages will be installed to a directory named ``node_modules``.

**3. Begin the build process**

Issue this command to kick off the build process: ::

    npm run build

The output will create a built Candela package in ``build/candela/candela.js``.

Watch the output for any errors.  In most cases, an error will halt the
process, displaying a message to indicate what happened.  If you need any help
deciphering any such errors, drop us a note on
`GitHub issues <https://github.com/Kitware/candela/issues/new>`_
or on `Gitter <https://gitter.im/Kitware/candela>`_ chat.

**4. View the examples**

Candela contains several examples used for testing, which also may be useful
for learning the variety of visualizations available in Candela. To build
the examples, run: ::

    npm run build:examples

To view the examples, run: ::

    npm run examples

**5. Run the test suites**

Candela comes with a battery of tests.  To run these, you can
invoke the test task as follows: ::

    npm run test:all

This runs both the unit and image tests.  Each test suite can be run on its
own, with: ::

    npm run test:unit

and::

    npm run test:image

Each of these produces a summary report on the command line.

**6. Build the documentation**

Candela uses `Sphinx <http://www.sphinx-doc.org/>`_ documentation hosted on
`ReadTheDocs <https://candela.readthedocs.io/>`_.
To build the documentation locally, first install the required Python dependencies: ::

    pip install -r requirements-dev.txt

When the installation completes, issue this command: ::

    npm run docs

The documentation will be hosted at `http://localhost:3000 <http://localhost:3000>`_.

Python
------

**1. Install software dependencies**

To use Candela from Python you will need Python 2.7 and ``pip``.

**2. Install the library locally** ::

    pip install -e .

**3. Test the installation**

Issue this command to start Jupyter notebook server in your browser: ::

    jupyter-notebook

Create a notebook from the New menu and enter the following in a cell,
followed by Shift-Enter to execute the cell and display the visualization: ::

    import requests
    data = requests.get(
        'https://raw.githubusercontent.com/vega/vega-datasets/gh-pages/data/iris.json'
    ).json()

    import pycandela
    pycandela.components.ScatterPlot(
        data=df, color='species', x='sepalLength', y='sepalWidth')


R - using ``install_github`` or Git checkout
--------------------------------------------

This procedure will install Candela either directly from GitHub
or from a local Git checkout of Candela.

**1. Install** `R <https://www.r-project.org/>`_ **, and optionally** `RStudio <https://www.rstudio.com/>`_

**2. Install the Candela package**

To install directly from GitHub: ::

    install.packages('devtools')
    devtools::install_github('Kitware/candela', subdir='R/candela', dependencies = TRUE)

To install from a Git checkout, set your working directory to the Git checkout
then install and check the installation. ``check()`` will run tests and perform
other package checks. ::

    setwd('/path/to/candela/R/candela')
    install.packages('devtools')
    devtools::install(dependencies = TRUE)
    devtools::check()

**3. Test the installation**

The following will create a scatter plot of the ``mtcars`` dataset and save it to ``out.html``: ::

    library(candela)
    w <- candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')
    htmlwidgets::saveWidget(w, 'out.html')

From RStudio, the visualization will appear in the application when you
refer to a visualization without assigning it to a variable: ::

    w

**Note:** ``saveWidget`` requires an installation of Pandoc when run outside of
RStudio. See the `installation instructions
<https://github.com/rstudio/rmarkdown/blob/master/PANDOC.md>`_ to install.
