==================
    Versioning
==================

Candela uses `semantic versioning <http://semver.org/>`_ for its version
numbers, meaning that each release's version number establishes a promise about
the levels of functionality and backwards compatibility present in that release.
Candela's version numbers come in two forms: *x.y* and *x.y.z*.  *x* is a *major
version number*, *y* is a *minor version number*, and *z* is a *patch level*.

Following the semantic versioning approach, major versions represent a stable
API for the software as a whole.  If the major version number is incremented, it
means you can expect a discontinuity in backwards compatibility.  That is to
say, a setup that works for, e.g., version 1.3 will work for versions 1.4, 1.5,
and 1.10, but should not be expected to work with version 2.0.

The minor versions indicate new features or functionality added to the previous
version.  So, version 1.1 can be expected to contain some feature not found in
version 1.0, but backwards compatibility is ensured.

The patch level is incremented when a bug fix or other correction to the
software occurs.

Major version 0 is special: essentially, there are no guarantees about
compatibility in the 0.\ *y* series.  The stability of APIs and behaviors begins
with version 1.0.

In addition to the standard semantic versioning practices, Candela also tags the
current version number with "dev" in the Git repository, resulting in version
numbers like "1.1dev" for the Candela package that is built from source.  The
release protocol deletes this tag from the version number before uploading a
package to the Python Package Index.
