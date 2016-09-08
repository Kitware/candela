=====================
    Candela R API
=====================

The Candela R library is ... TBD

.. function:: candela.bar([context, ]msg[, lvl=loglevel])

    Writes a message `msg` to the log file.  The optional `context` is a
    descriptive tag that will be prepended to the message within the log file
    (defaulting to "TANGELO" if omitted).  Common context tags used internally
    in Tangelo include "TANGELO" (to describe startup/shutdown activities), and
    "ENGINE" (which describes actions being taken by CherryPy).  This function
    may be useful for debugging or otherwise tracking a service's activities as
    it runs.  The optional logging level ``lvl`` is one of the python logging
    constants.  By default, ``logging.INFO`` is used.

    Generally you should use one of the variants of this function listed below,
    but if you want to write a logging message in the terminal's default color,
    you can use this function, specifying the log level you need.
