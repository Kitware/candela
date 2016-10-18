from distutils.core import setup

setup(
    name='pycandela',
    version='0.3.0',
    description='Jupyter interface for Candela visualization components',
    author='Kitware, Inc.',
    author_email='kitware@kitware.com',
    license='Apache 2.0',
    url='https://github.com/Kitware/candela',
    packages=['pycandela'],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7'
    ],
    install_requires=[
        'jupyter',
        'pandas'
    ]
)
