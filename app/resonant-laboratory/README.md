# Resonant Laboratory

Choose your own visualization adventure.

## Setup: Installation

1. [Install Girder prerequisites](http://girder.readthedocs.org/en/latest/prerequisites.html).

2. [Install Girder from a Git checkout](http://girder.readthedocs.org/en/latest/installation.html#install-from-git-checkout).

3. Run the following after cloning this repository:

  ```bash
  cd candela_repo_dir
  npm install
  npm run build:laboratory
  ```

4. Install the plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/resonant-laboratory
  ```

5. Rebuild Girder:

  ```bash
  cd girder_repo_dir
  grunt
  ```

## Setup: First Run

1. Start girder:

  ```bash
  girder-server
  ```

2. Register an admin account at ([localhost:8080](http://localhost:8080))

3. Go to Admin console -> Plugins to enable the Resonant Laboratory App plugin

4. Restart Girder

The Resonant Laboratory App will replace the Girder interface at ([localhost:8080](http://localhost:8080))
(you can still access the girder interface at ([localhost:8080/girder](http://localhost:8080/girder)))

5. Optionally, you can add an example library to the girder instance
   by running this script from the `examples` directory:

   ```bash
   cd examples
   python populateGirder.py
   ```

## Development

There are several build steps before changes to the code will
be visible in the browser. The Girder server has an option
to recognize internal changes without necessitating a restart:

  ```bash
  cd girder_repo_dir
  girder-server --testing
  ```

We've also added to webpack's watch mode, so that it triggers
girder's grunt build step when you change code in resonant-laboratory. To
use it:

  ```bash
  export GIRDER_PATH=girder_repo_dir
  cd candela_repo_dir/app/resonant-laboratory
  webpack --watch
  ```
