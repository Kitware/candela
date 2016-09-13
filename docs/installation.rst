====================
    Installation
====================

There are two ways to install Candela: from standard package repositories systems such as
npm and the Python Package Index (PyPI)
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

Before any of these source installations, you will need to issue this git
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
* cairo (``brew install cairo`` on macOS)

**2. Install Node dependencies**

Issue this command to install the necessary Node dependencies via the Node
Package Manager (NPM): ::

    npm install

The packages will be installed to a directory named ``node_modules``.

**3. Begin the build process**

Issue this command to kick off the Grunt build process: ::

    npm run build

The output will create a built Candela package in ``build/candela/candela.js``.

Watch the output for any errors.  In most cases, an error will halt the
process, displaying a message to indicate what happened.  If you need any help
deciphering any such errors, drop us a note on [GitHub issues](https://github.com/Kitware/candela/issues/new)
or on [Gitter](https://gitter.im/Kitware/candela) chat.

**4. View the examples**

Candela contains several examples used for testing, which also may be useful
for learning the variety of visualizations available in Candela. To build
the examples, run: ::

    npm run build:examples

To view the examples, run: ::

    npm run examples

**5. Run the test suites**

Candela comes with a battery of tests.  To run these, you can
invoke the Grunt test task as follows: ::

    npm run test:all

This runs both the unit and image tests.  Each test suite can be run on its
own, with: ::

    npm run test:unit

and::

    npm run test:image

Each of these produces a summary report on the command line.

Python
------

**1. Install software dependencies**

To use Candela from Python you will need Python 2.7 and ``pip``.

From the source directory, install additional package dependencies with: ::

    pip install -r requirements-dev.txt

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


R - using ``install_github``
----------------------------

This procedure will install Candela directly from GitHub, which does not require
a Git checkout of Candela.

**1. Install** `R Studio <https://www.rstudio.com/>`_

**2. Install the Candela package** ::

    install.packages('devtools')
    devtools::install_github('Kitware/candela', subdir='R/candela')

**3. Test the installation**

The following will create a scatter plot of the ``mtcars`` dataset: ::

    library(candela)
    candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')

R - from a Git checkout
-----------------------

**1. Install** `R Studio <https://www.rstudio.com/>`_

**2. Change the working directory**

Navigate to the ``candela/R/candela`` directory in the Files tab in
RStudio and select Set As Working Directory from the More menu.

**3. Install the Candela package** ::

    install.packages('devtools')
    devtools::install()

**4. Test the installation**

The following will create a scatter plot of the ``mtcars`` dataset: ::

    library(candela)
    candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')
