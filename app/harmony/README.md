# Harmony

Choose your own visualization adventure.

## Installation

1. [Install Girder prerequisites](http://girder.readthedocs.org/en/latest/prerequisites.html).

2. [Install Girder from a Git checkout](http://girder.readthedocs.org/en/latest/installation.html#install-from-git-checkout).

3. Run the following after cloning this repository:

  ```bash
  cd resplendent_repo_dir
  npm install
  npm run build-harmony
  ```

4. Install the Harmony plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/harmony
  ```

5. Rebuild Girder:

  ```bash
  cd girder_repo_dir
  grunt
  ```

4. Visit the Girder admin interface to enable the Harmony plugin and restart Girder.

## Incremental build

```bash
cd resplendent_repo_dir
npm run build-harmony
cd girder_repo_dir
grunt
```
