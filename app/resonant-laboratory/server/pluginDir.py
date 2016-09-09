import inspect
import os


def pluginDir():
    # This function works by grabbing the current stack, examining the first
    # frame (which refers to the invocation of this very function), and
    # extracting the second element of it, which refers to the filename
    # containing the module that exports this function. Since that module is in
    # the 'server' subdirectory of the top-level directory, appending .. to that
    # path gets us the base plugin directory.
    me = inspect.stack()[0][1]
    mydir = os.path.dirname(me)
    pluginDir = os.path.join(mydir, '..')

    return os.path.abspath(pluginDir)
