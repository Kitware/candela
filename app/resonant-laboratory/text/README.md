Resonant Laboratory Text
========================

This file outlines most of the user-facing text in Resonant Laboratory.

*TODO: Ideally, we should convert this file into some kind of `en.json` file that the app actually uses for its text content (will make internationalization much easier).*

# Message Dialog Boxes
## About Dialog
TODO: The [template](../views/overlays/AboutResonantLab/template.html) definitely needs more text!

## Success Screens
Here is the [template](../views/layout/Overlay/successTemplate.html), and these are the messages that can go in the template:
- The dataset appears to have loaded correctly.
- You've wired up all the connections that the visualization needs. Well done!
- The visualization appears to be functioning correctly.

## Loading Screens
Here's the [template](../views/layout/Overlay/loadingTemplate.html), and these are the messages:
- Still accessing this project's datasets...
- Still accessing this project's matching settings...
- Still attempting to render the visualization...

## User Error Screens
The idea behind this screen is the user still needs to do something for something to work (the user should be able to fix these on their own). Here's the [template](../views/layout/Overlay/userErrorTemplate.html), and these are the messages, broken down by panels:

#### Dataset panel
- You have not chosen a dataset yet. Click [here](#) to choose one.
- There was a problem parsing the data; you\'ll probably need to [edit](#) or [reshape](#) the data in order to use it.
- There was a problem parsing the data. Specifically, we\'re having trouble understanding the dataset attributes (usually column headers); you\'ll probably need to [edit](#) or [reshape](#) the data in order to use it.

#### Matching panel
- You need to choose both a Dataset and a Visualization in order to connect them together.
- The visualization needs more connections to data in order to display anything.

#### Visualization panel
- You have not chosen a visualization yet. Click [here](#) to choose one.
- This visualization needs more data matchings. Make sure there are no orange warning triangles in the Matching panel.

## Regular Error Screens
The idea behind these screens is that some kind of error has happened, but it's one that we know about, and it's supposed to happen (the user may or may not be able to fix these on their own). Here's the [template](../views/layout/Overlay/errorTemplate.html), and these are the messages:
- You don\'t have the necessary permissions to delete that project.
- Sorry, you can\'t delete projects unless you [log in](#).
- The dataset could not be loaded; there is a good chance that there is a permissions problem.

## System Failure Screens
The idea behind these screens is something really bad happened—something that we didn't anticipate. So we have a [template](../views/layout/Overlay/reallyBadErrorTemplate.html), but the messages and details will probably be really cryptic.

# Control Dialog Boxes
These dialog boxes are a little more complex than simple messages.

## Dataset Settings
- Sidebar Menu possibilities:
  - Delete dataset
  - Remove from project
  - One of:
    - Switch to a different dataset
    - Add a dataset to the project
    - Open a dataset in a new project
- Status / Alert / Error messages:
  - Name: < rename field >
  - Size: < file size >
  - Girder Location: [path/to/item/in/girder](#)
  - Access:
    - Private
    - Public
    - Public Scratch Space
    - Library
  - No dataset selected
  - Are you sure you want to delete the < dataset name > dataset?
- Tooltips:
  - You can edit this dataset
  - You can't edit this dataset
  - Others can see this dataset
  - This dataset is private
  - This is a dataset in our library of examples
  - Others can see and edit this dataset
- Contents:
  - Upload a new Dataset
    - Browse or drop files here
    - No files selected (or filename + size)
    - Error message:

      Supported formats:
        - CSV
        - TSV
        - JSON

      Want to upload something else? [Work with us](#) to develop something that better meets your needs.
  - Link to a new Dataset
    - Error message:

      "< some funky input >" is not a valid Girder item ID.

      Supported link types:
        - The ID of an existing Girder item

      Want to link to something else? [Work with us](#) to develop something that better meets your needs.
  - Your Private Datasets
    - Advanced access permissions can be set in the [Girder interface](#).
  - Your Public Datasets
    - Anyone can see these datasets.
  - Your Datasets in the Public Scratch Space
    - Anyone can see or edit these datasets at any time. [Log in](#) or [Register](#) to take control of who can see or edit these datasets.
  - Public Dataset Library

  ## Project Settings
  - Sidebar Menu possibilities:
    - Save a copy
    - Delete
    - New empty project
    - One of:
      - Open a project
      - Open a different project
    - Copy a link to the project
  - Status / Alert / Error messages:
    - Name: < rename field >
    - Girder Location: [path/to/item/in/girder](#)
    - Access:
      - Private
      - Public
      - Public Scratch Space
      - Library
    - One of:
      - No project loaded
      - A project connects datasets to visualizations. If a project is public, you can share it simply with its URL. Only users with access will be able to see it.
    - Are you sure you want to delete the < project name > project?
  - Tooltips:
    - You can edit this project
    - You can't edit this project
    - Others can see this project
    - This project is private
    - This is a project in our library of examples
    - Others can see and edit this project
  - Contents:
    - Your Private Projects
      - Advanced access permissions can be set in the [Girder interface](#).
    - Your Public Projects
      - Anyone can see these projects.
    - Your Projects in the Public Scratch Space
      - Anyone can see or edit these projects at any time. [Log in](#) or [Register](#) to take control of who can see or edit these projects.
    - Public Projects Library

# Menus and Buttons
TODO: These are short, and they shouldn't be hard to find... but an `en.json` file should still have entries for them.

# Empty State
TODO: We don't have much here yet; things like the matching panel should also have helpful text / maybe a legend to help orient the user and motivate them to try things.
- Try one of these buttons or bars to get started.
- Need a hand? Try the ? buttons.

# Notifications
These show up as little notifications in the bottom corner that the user can close, or they automatically fade after a while.
- You are now working on a copy of this project in the public scratch space. Log in to take ownership of this project.
- You are now working on a copy of this project in your Private folder.
- You are now working with a copy of the < dataset name > dataset, stored in your Private folder.
- You are now working with a copy of the < dataset name > dataset, stored in the public scratch space. Log in to take ownership of this dataset.
- Moved # of # projects that you were working on when you were logged out to your Private folder
- Moved # of # datasets that you were working on when you were logged out to your Private folder
- Could not restore datasets from when you were logged out
- Could not restore projects from when you were logged out
- Link successfully copied to clipboard
- Sorry, couldn\'t copy the link for some reason. Try copying this page\'s URL from your browser\'s address bar instead.

# Tips
When the user clicks one of the question mark buttons, these messages show up in bubbles with an arrow pointing to somewhere on the screen:
- Change who can see the project you're working on
- Rename this project
- Add a dataset to this project
- See/change the datasets in this project
- Manage the connections between the datasets and the visualizations in this project
- See/change the visualizations in this project
- Add a visualization to this project
- Show these tips. Tips that you haven't seen yet are shown in yellow.
- Main Menu
- Collapse / expand this panel
- Dataset filter and paging settings
- Click to select a different dataset
- There are no required visual encodings
- # of the minimum required # connections have been established
- Click to select a different visualization
- (TODO: this list is incomplete)

# Dataset Overview
These are the ways that the overview is explained:
- Visualizing all # items in the dataset.
- Visualizing items # - # of # total items.
- Visualizing # items of the # total items in the dataset.
- Visualizing items # - # of # filtered items. There are # total items
in the dataset (ignoring filters).
