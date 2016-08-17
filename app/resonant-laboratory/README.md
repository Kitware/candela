# Resonant Laboratory

Choose your own visualization adventure.

To use, you have two choices: [build and install
yourself](#installation-from-source) or [use Ansible](#installation-via-ansible)

## Installation from Source

1. [Install Girder prerequisites](http://girder.readthedocs.org/en/latest/prerequisites.html).

2. [Install Girder from a Git checkout](http://girder.readthedocs.org/en/latest/installation.html#install-from-git-checkout). Note that all the following steps assume you are running shell commands
using the `virtualenv` described in the girder setup instructions.

3. Install the [database_assetstore plugin](https://github.com/OpenGeoscience/girder_db_items):

  ```bash
  git clone https://github.com/OpenGeoscience/girder_db_items.git database_assetstore
  cd database_assetstore
  npm install
  cd ..
  girder-install plugin -s database_assetstore
  ```

4. Run the following after cloning this repository:

  ```bash
  git clone https://github.com/Kitware/candela.git
  cd candela
  npm install
  npm run build
  npm run build:laboratory
  ```

5. Install the plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/resonant-laboratory
  ```

### Setup: First Run

1. Start girder:

  ```bash
  girder-server
  ```

2. Register an admin account at [localhost:8080](http://localhost:8080)

3. Go to Admin console -> Plugins to enable the Resonant Laboratory plugin

4. Restart Girder

Resonant Laboratory will replace the Girder interface at [localhost:8080](http://localhost:8080). It should give you an
error telling you that no assetstores have been configured.

5. Access the girder interface again, this time at [localhost:8080/girder](http://localhost:8080/girder). Navigate to
Admin console -> Assetstores

6. Click Create new Database assetstore, and choose a name (anything is fine), MongoDB as the Database Type, and `mongodb://localhost:27017/assetstore` as the Database URI (feel free to change "assetstore" to whatever database name you like)

7. Click Create new Filesystem assetstore, again picking whatever name strikes your fancy, and give it a path that you have write access to for its Root directory. Once created, make sure to click "Set as current"

8. Optionally, at this point you can add an example library to the girder instance
   by running this script from the `scripts` directory (by default, it assumes that you've set up a user account named `admin`; try `python populateGirder.py --help` for details about how to change this):

   ```bash
   cd examples
   pip install girder_client
   python populateGirder.py
   ```

### Adding datasets

For now, `.csv` and `.json` files can to be uploaded via girder's interface to the user's public or private directories. Once a file has been uploaded, you should issue a `POST` request to `/item/{id}/dataset` so that Resonant Laboratory will know that it's a dataset.

In addition to flat files, Resonant Laboratory also supports connecting to mongo databases. For example, a mongo collection could be added from a `json` file this way:

  ```bash
  mongoimport --db test --collection gapminder --drop --file gapminder.json --jsonArray
  ```

or to load a `csv` file:

  ```bash
  mongoimport --db test --collection cars --drop --file gapminder.csv --type csv --headerline
  ```

Then an item should be created in the user's public or private directory to represent this database (in this case, probably named "gapminder"). To connect the item to the database, issue a `POST` request to `/item/{id}/database`:

  ```
  {"url":"localhost:27017","database":"test","collection":"gapminder","type":"mongo"}
  ```

Of course, after connecting the girder item to the database, you also still need to hit the `/item/{id}/dataset` endpoint to indicate that it is also a dataset intended for Resonant Laboratory.

### Development

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

## Installation via Ansible

Resonant Laboratory comes with an Ansible deployment strategy as well. To use
it, you will need Ansible 2.0:

```shell
pip install ansible==2.0
```

Next, clone this repository:

```shell
git clone https://github.com/Kitware/candela
```

Move into the `candela/app/resonant-laboratory` directory, and then create the
Vagrant box with

```shell
vagrant up
```

This will configure, provision, and launch a virtual machine, which will set up
Girder, the example datasets, and Resonant Laboratory itself, and forward
Resonant Laboratory to port 8080 on your local machine. Then you can use
Resonant Laboratory by visiting http://localhost:8080.

If port 8080 is being used for another purpose on your local machine already,
you can use the `RESLAB_HOST_PORT` environment variable to set a different one:

```shell
RESLAB_HOST_PORT=9090 vagrant up
```
