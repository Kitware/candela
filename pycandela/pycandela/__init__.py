import IPython.core.displaypub as displaypub
import random


def random_hash():
    hash = random.getrandbits(128)
    return '%032x' % hash


def load_notebook():
    # vis_el = random_hash()

    js = """
element.append('<div>Hello World!</div>');
"""

    publish_display_data({'application/javascript': js})


def publish_display_data(data):
    try:
        displaypub.publish_display_data('pycandela', data)
    except TypeError:
        displaypub.publish_display_data(data)
