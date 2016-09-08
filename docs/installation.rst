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

Building the JavaScript library (required)
------------------------------------------

Candela is developed on `GitHub <https://github.com/Kitware/candela>`_.  If you
wish to contribute code, or simply want the very latest development version, you
can download, build, and install from GitHub, following these steps:

**1. Install software dependencies**

To build Candela from source, you will need to install the following software:

* Git
* Python 2.7
* Virtualenv 12.0
* Node.js

**2. Check out the Candela source code**

Issue this git command to clone the Candela repository: ::

    git clone git://github.com/Kitware/candela.git

This will create a directory  named ``candela`` containing the source code.  Use
``cd`` to move into this directory: ::

    cd candela

**3. Install Node dependencies**

Issue this command to install the necessary Node dependencies via the Node
Package Manager (NPM): ::

    npm install

The packages will be installed to a directory named ``node_modules``.

**4. Begin the build process**

Issue this command to kick off the Grunt build process: ::

    npm run build

The output will create a built Candela package in ``build/candela/candela.js``.

Watch the output for any errors.  In most cases, an error will halt the
process, displaying a message to indicate what happened.  If you need any help
deciphering any such errors, drop us a note on [GitHub issues](https://github.com/Kitware/candela/issues/new)
or on [Gitter](https://gitter.im/Kitware/candela) chat.

**5. View the examples**

Candela contains several examples used for testing, which also may be useful
for learning the variety of visualizations available in Candela. To build
the examples, run: ::

    npm run build:examples

To view the examples, run: ::

    npm run examples

**6. Run the test suites**

Candela comes with a battery of tests.  To run these, you can
invoke the Grunt test task as follows: ::

    npm run test:all

This runs both the unit and image tests.  Each test suite can be run on its
own, with::

    npm run test:unit

and::

    npm run test:image

Each of these produces a summary report on the command line.

Using the Python library from a Git checkout
--------------------------------------------
TBD

Installing the R library using ``install_github``
-------------------------------------------------
TBD

Using the R library from a Git checkout
---------------------------------------
TBD
