# Resonant Lab

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
  girder-install plugin -s database_assetstore
  ```

4. Run the following after cloning this repository:

  ```bash
  git clone https://github.com/Kitware/candela.git
  cd candela
  npm install
  npm run build
  npm run build:resonantlab
  ```

5. Install the plugin using `girder-install`:

  ```bash
  girder-install plugin -s app/resonantlab
  ```

### Setup: First Run

1. Start girder:

   ```bash
   girder-server
   ```

2. Register an admin account at [localhost:8080](http://localhost:8080)

3. Go to Admin console -> Plugins to enable the Resonant Lab plugin

4. Restart Girder

   Resonant Lab will replace the Girder interface at [localhost:8080](http://localhost:8080). It should give you an
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

For now, `.csv` and `.json` files can to be uploaded via girder's interface to the user's public or private directories. Once a file has been uploaded, you should issue a `POST` request to `/item/{id}/dataset` so that Resonant Lab will know that it's a dataset.

In addition to flat files, Resonant Lab also supports connecting to mongo databases. For example, a mongo collection could be added from a `json` file this way:

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

Of course, after connecting the girder item to the database, you also still need to hit the `/item/{id}/dataset` endpoint to indicate that it is also a dataset intended for Resonant Lab.

### Development

There are several build steps before changes to the code will
be visible in the browser. The Girder server has an option
to recognize internal changes without necessitating a restart:

```bash
girder-server --testing
```

We've also augmented webpack's `--watch` mode, so that it automatically triggers
girder's grunt build step when you change code in resonantlab. To
use it:

```bash
export GIRDER_PATH=path/to/girder
cd path/to/candela/app/resonantlab
webpack --watch
```

## Installation via Ansible

Resonant Lab comes with an Ansible deployment strategy as well. To use
it, you will need Ansible 2.2:

```shell
pip install ansible==2.2
```

Next, clone this repository:

```shell
git clone https://github.com/Kitware/candela
```

Move into the `candela/app/resonantlab` directory, and then create the
Vagrant box with

```shell
vagrant up
```

This will configure, provision, and launch a virtual machine, which will set up
Girder, the example datasets, and Resonant Lab itself, and forward
Resonant Lab to port 8080 on your local machine. Then you can use
Resonant Lab by visiting http://localhost:8080.

If port 8080 is being used for another purpose on your local machine already,
you can use the `RESLAB_HOST_PORT` environment variable to set a different one:

```shell
RESLAB_HOST_PORT=9090 vagrant up
```

You can also supply some Ansible ["extra
variables"](http://docs.ansible.com/ansible/playbooks_variables.html#passing-variables-on-the-command-line)
to Vagrant via the `ANSIBLE_EXTRA_VARS` environment variable:

```shell
ANSIBLE_EXTRA_VARS="adminuser_login=root adminuser_password=hunter2" vagrant up
```

in case you want to change the default values of the following variables used
during the provisioning process:

- `adminuser_firstname` - administrator account's first name (default:
  **Admin**)
- `adminuser_lastname` - administrator account's last name (default: **User**)
- `adminuser_login` - administrator account's username (default: **admin**)
- `adminuser_password` - administrator account's password (default:
  **adminadmin**)
- `adminuser_email` - administrator account's email address (default:
  **admin@example.com**)
- `storage` - the path on disk in which to store the build inputs such as Git
  clones and Girder resources (default: **/home/vagrant**)
- `girder_revision` - the git checkout hash to use to build Girder (default:
  **6bda1a7b65bea1c11187cdeb136877739693f466**)
- `girder_client_revision` - the git checkout hash to use to install Girder
  Client (default: **6bda1a7b65bea1c11187cdeb136877739693f466**)
- `database_assetstore_revision` - the git checkout hash to use for the database
  assetstore Girder plugin (default:
**a530c9546d3ac4f50ec4519ef6c7bb348e2b4bc7**)
- `candela_revision` - the git checkout hash to use to build Candela and
  Resonant Lab (default: **5c17f10d754778e7ea291f1f24c290d997e4dec8**)

The most important of these may be `adminuser_password`; changing this option at
provisioning time allows you to keep administrator access to the underlying
Girder instance secure.

## Guide to the server-side code

### Endpoints
Resonant Lab introduces several endpoints for:
- supporting anonymous access to items (largely abstracted away from Resonant Lab; it shouldn't be hard to roll this into its own Girder plugin)
- setting up datasets and projects
- inferring the schema of a dataset
- calculating a histogram of all the attributes in a dataset in one pass

Both `inferSchema` and `getHistgorams` necessitate a full table scan of the dataset, so we've included caching mechanisms (that are not currently enabled).

It's important to note that the three dataset endpoints are designed to be run in order, as each attaches a layer of metadata to the girder item:
1. `dataset`
2. `inferSchema`
3. `getHistograms`

For details on exactly what is stored in the metadata, see the README.json files in the `models` directory.

### MapReduce
We try to keep the data coercion, inference, and histogram calculation code in the same place, even though it can be run in many locations. More details are in `general_purpose/README.md`.

Some of the javascript is a little messy to make it compatible with mongodb's `inline_map_reduce`. However, as we've discovered `inline_map_reduce` makes us fake an offset for mongodb anyway (there is a limit parameter, but no offset-the more efficient way will be to just use the mapreduce-during-download approach that we take with flat files), it's probably worth simplifying the Javascript files / removing any inline javascript in the python code.

In addition to cleaning the code, there are many potential optimizations, and possible places for improvements are flagged inline with `TODO` comments. For debugging convenience, we've disabled all the caching of mapreduce results, but this can be enabled with a single flag in the client side REST calls.

## Guide to the client-side model code
With the exception of `User.js`, each model in Resonant Lab corresponds to an item in Girder, but they don't follow Girder's client-side pattern for models. Instead, they try to behave like real Backbone models that support things like `.save()`.

Because Girder breaks saving metadata, and also because we namespace all Resonant Lab metadata under a `rlab` metadata key, there are `setMeta()` and `getMeta()` convenience functions on each of these models that behave like Backbone's `get()` and `set()`.

### Datasets and Projects
The two most important models are `Dataset.js` and `Project.js`. These are documented in README.json files that detail how the metadata is structured and what each piece does.

One of the big complications in Resonant Lab's code has to do with the fact that projects and datasets may not always exist—consequently, all the views have to listen to the `mainPage.js` for changes in whatever project is open, and when that happens, reattach listeners to the new project. Dataset-specific views sometimes do a second round of this for individual datasets; they also have to listen for changes in what datasets have been added to projects, and reattach listeners to the datasets when they're added.

It might make more sense to give projects a Backbone Collection of datasets (early versions of Resonant Lab tried this, but it proved unwieldy). Currently, changes in datasets are generalized under a `rl:changeDatasets` event that the project model forwards to all views—it's kind of inefficient, but this cleans up the code a bit.

### UserPreferences
Rather than store user-specific information right in the User model, we decided early on to store user preferences as a distinct item in the User's private directory. This should have a lot of benefits, like letting the user know (and change/delete!) exactly what information we are storing about them.

When the user is logged out, there are some attempts to save this information in the browser's LocalStorage (like which projects/datasets the user was working with), but I haven't been very thorough about this—there are likely a few bugs here. A cool thing to do would maybe be to make some kind of abstract `LocalItem` model that syncs to LocalStorage instead of/in addition to the server.

## Guide to client-side view code
There are three levels of views (corresponding to directories in `views`).

### `views/layout`
These are the big, separate chunks of the interface, like the header, the overlay that shows all the dialog boxes and menus, the toast notification layer, the help layer, and the widget accordion. Each of these can be accessed globally via the main page, e.g. `window.mainPage.overlay.render(someView)`.

#### Header
This should be reasonably straightforward, though the ordering in the template is a little funky for historical CSS reasons (that aren't relevant anymore—feel free to change this).

The code that generates the middle section has various icons commented out; their original purpose was to support multiple datasets/visualizations—to have an icon for each panel (plus icons to add new datasets / visualizations). But as the header is being populated by other things, and the new dataset settings might be a more natural place for these interactions, we may just want to delete those commented parts.

#### Help Layer
This controls how the help bubbles are displayed. To create a series of help bubbles, pass it an ordered array of tips (see `views/layout/Header/tips.json` for a good example)-the bubbles will be displayed in the order of the array, and point to whatever selector you provide (with a hole that allows the user to interact directly with whatever the bubble is pointing at).

#### Notification Layer
These display in the bottom right, and auto-close after a while if not directly closed. Displaying a notification should be as simple as `window.mainPage.notificationLayer.displayNotification('There\'s always money in the banana stand.');` or `window.mainPage.notificationLayer.displayNotification('No touching!', 'error')` for the orange ones.

#### Overlay
This one is a little more involved; the idea is to be able to `window.overlay.render(anything)`; `anything` could be one of the string names of views in the `VIEWS` object, a Backbone view (class definition *or* instance), or even just a plain HTML string.

There are also convenience functions like `renderReallyBadErrorScreen()` that display dialogs like the one with the flaming banana stand. One function in here might be a little out of place: there's a generic `handleError()` function that tries to format any kind of error (javascript, network, etc) for display in the error screen dialog. It might make more sense somewhere else like `mainPage.js`, or its own view that enables better error reporting.

The only funkiness here (that probably needs a rewrite) has to do with the close box; if there's a `#closeOverlay` object that can be found in the DOM, it will try to auto-attach the appropriate event listeners. If such an object *doesn't* exist, it interprets the view as something that needs a special action before it can be dismissed, and deliberately avoids attaching ways to close the dialog (TODO: the overlay should probably should just accept a distinct parameter that specifies whether it's closable). I've found that some things break the close listener behavior anyway (e.g. if you display a Backbone view that does a `this.$el.html()` every render call, the listeners will get lost—so you'll need to `window.mainPage.overlay.addCloseListeners()` manually).

#### WidgetPanels
This is the thing in charge of rendering each panel (not the contents, just the header bars + collapsing / expanding). Most of the magic is actually just fancy CSS in `accordionhorz.scss`. The rest of the widget rendering takes place in `views/widgets/`.

One refactoring idea might be to try and merge this view with `views/widgets/index.html`—over time, the distinction has become less useful (and individual views do kinda funky things to mess with their title bars).

### `views/overlays`
Each of these are named views in `views/layout/overlay`; you can show one simply by calling `window.mainPage.overlay.render('ProjectLibrary')`. Most should be somewhat self-explanatory, though there is some inheritance going on between a few of them:
- Settings Panel (generalizes the side menu on the left, and a text blurb to help with empty states on the right)
  - ProjectSettings (specifies the project menu items, adds controls to the right)
    - ProjectLibrary ("selects" the Library menu item, and overrides the controls on the right to show the library)
  - DatasetSettings (specifies the dataset menu items, adds controls to the right)
    - DatasetLibrary ("selects" the Library menu item, and overrides the controls on the right to show the library)

The VisualizationLibrary doesn't yet fit in this structure, but it shouldn't be hard to imagine how it could.

### `views/widgets`
These draw the contents of the panels, and inherit from `Widget/index.js`. They're each kind of bulky, and could probably use breaking the contents up into subviews (e.g., in porting the DatasetView to MSKCC, I broke the histograms up into separate views—but I haven't gotten around to this in Resonant Lab yet).

To understand what's going on in each `initialize()` function, it's probably worth looking at the `Widget/index.js` code—`this.icons` and `this.statusText` are special variables that the views can use to control what gets displayed in their header bar.

## Oddities to watch out for

### Broken Backbone Models, Anonymous Access
Because Girder breaks Backbone model syncing (especially for metadata), Resonant Lab attempts to patch Backbone's native `save()`-style behavior. For specifics, see the comments in `models/MetadataItem.js`.

The only thing that anonymous access introduces on the client side that is a little weird is when the user tries to `save()` an item, but doesn’t have write access (e.g. they’re logged out). The server honors the `save()` request, but saves to a copy... meaning that, from the client’s perspective, the item model’s ID will get swapped out from underneath it. `MetadataItem.js` tries to make this ID swap seamless as far as Backbone is concerned, but it also emits a special `‘rl:swappedId’` event because other parts of the client code likely use IDs for things.

### Events and Promises
Perhaps the most confusing / hard-to-debug parts of the code will involve the way we use Backbone events and promises. Generally speaking, the code uses Backbone events for client-side-only signaling. All Resonant Lab backbone events are prefixed with `rl:`.

Data that is dependent on server communication is usually accessed via a combination of ES6 promises and getters / setters. The two main places this happens are `models/Dataset.js` and `models/Project.js`—each has a `cache` object, independent from the Backbone model, with properties that are lazily evaluated (e.g. `window.mainPage.project.status.then(...)` will either resolve immediately, or send the request to the server if necessary). Indicating the need for an update is then as simple as invalidating the cache, and emitting the appropriate Backbone signals (ideally, we should refactor this so that `change:value` signals get emitted automatically).
