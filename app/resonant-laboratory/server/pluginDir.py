import inspect
import os


def pluginDir():
    me = inspect.stack()[0][1]
    mydir = os.path.dirname(me)
    pluginDir = os.path.join(mydir, '..')

    return os.path.abspath(pluginDir)
