# Resonant Laboratory

Choose your own visualization adventure.

## Setup: Installation

1. [Install Girder prerequisites](http://girder.readthedocs.org/en/latest/prerequisites.html).

2. [Install Girder from a Git checkout](http://girder.readthedocs.org/en/latest/installation.html#install-from-git-checkout). Note that all the following steps assume you are running shell commands
using the `virtualenv` described in the girder setup instructions.

3. Install the [girder_db_items plugin](https://github.com/OpenGeoscience/girder_db_items):

  ```bash
  git clone https://github.com/OpenGeoscience/girder_db_items.git
  cd girder_db_items
  npm install
  cd ..
  girder-install plugin -s girder_db_items
  ```

4. Run the following after cloning this repository:

  ```bash
  git clone https://github.com/Kitware/candela.git
  cd candela
  npm install
  npm run build:laboratory
  ```

5. Install the plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/resonant-laboratory
  ```

## Setup: First Run

1. Start girder:

  ```bash
  girder-server
  ```

2. Register an admin account at ([localhost:8080](http://localhost:8080))

3. Go to Admin console -> Plugins to enable the Resonant Laboratory plugin

4. Restart Girder

Resonant Laboratory will replace the Girder interface at ([localhost:8080](http://localhost:8080))
(you can still access the girder interface at ([localhost:8080/girder](http://localhost:8080/girder)))

5. Optionally, you can add an example library to the girder instance
   by running this script from the `examples` directory (by default, it assumes that you've set up an user account named `admin`; see `python populateGirder.py --help` for details):

   ```bash
   cd examples
   pip install girder_client
   python populateGirder.py
   ```

## Adding datasets
For now, `.csv` and `.json` files can to be uploaded via girder's interface to the user's public or private directories.

Resonant Laboratory also supports connnecting to mongo databases. For example, a mongo collection could be added from a `json` file this way:

  ```bash
  mongoimport --db test --collection gapminder --drop --file gapminder.json --jsonArray
  ```

or to load a `csv` file:

  ```bash
  mongoimport --db test --collection cars --drop --file cars.csv --type csv --headerline
  ```

Then an item should be created in the user's public or private directory to represent this database (in this case, probably named "gapminder"). To connect the item to the database, issue a `POST` request to `/item/{id}/database`:

  ```
  {"url":"localhost:27017","database":"test","collection":"gapminder","type":"mongo"}
  ```

## Development

There are several build steps before changes to the code will
be visible in the browser. The Girder server has an option
to recognize internal changes without necessitating a restart:

  ```bash
  girder-server --testing
  ```

We've also augmented webpack's `--watch` mode, so that it automatically triggers
girder's grunt build step when you change code in resonant-laboratory. To
use it:

  ```bash
  export GIRDER_PATH=path/to/girder
  cd path/to/candela/app/resonant-laboratory
  webpack --watch
  ```
