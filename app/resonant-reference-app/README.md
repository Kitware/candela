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

4. Install the Harmony plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/resonant-reference-app
  ```

5. Rebuild Girder:

  ```bash
  cd girder_repo_dir
  grunt
  ```

6. Visit the Girder admin interface to enable the Resonant Reference App plugin and restart Girder.

## Incremental build

1. Rebuild:

  ```bash
  cd candela_repo_dir
  npm run build:reference
  cd girder_repo_dir
  grunt
  ```

2. Restart Girder.
