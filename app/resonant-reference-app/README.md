# Reference Application

Choose your own visualization adventure.

## Installation

1. [Install Girder prerequisites](http://girder.readthedocs.org/en/latest/prerequisites.html).

2. [Install Girder from a Git checkout](http://girder.readthedocs.org/en/latest/installation.html#install-from-git-checkout).

3. Run the following after cloning this repository:

  ```bash
  cd candela_repo_dir
  npm install
  npm run build:reference
  ```

4. Install the plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/resonant-reference-app
  ```

5. Rebuild Girder:

  ```bash
  cd girder_repo_dir
  grunt
  ```

## Running

1. Start girder:

  ```bash
  girder-server
  ```

2. Register at ([localhost:8080](http://localhost:8080))

3. Go to Admin console -> Plugins to enable the Resonant Reference App plugin

4. Restart Girder

The Resonant Reference App will replace the Girder interface at ([localhost:8080](http://localhost:8080))
(you can still access the girder interface at ([localhost:8080/girder](http://localhost:8080/girder)))

## Development

There are several build steps before changes will
be visible in the browser. The Girder server has an option
to recognize internal changes without necessitating a restart:

  ```bash
  cd girder_repo_dir
  girder-server --testing
  ```

However, for changes to get inside girder, a webpack step
is needed:
  ```bash
  cd candela_repo_dir
  npm run build:reference
  ```
  
followed by a grunt step:
  ```bash
  cd girder_repo_dir
  grunt
  ```
