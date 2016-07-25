Where to find all the text in Resonant Laboratory
=================================================

You should be able to get at all the "regular" text in the app by trying each of the options in the hamburger menu. Some of the other text may be a little harder to find, just because you need to get the app in a particular state to see the right error messages, etc.

# Dialog Boxes
A lot of dialog boxes customize a template with a short message; we can make as many or as few of these as we want.

## Success Screens
Here is the [template](successTemplate.html), and these are the messages that can go in the template:
- The dataset appears to have loaded correctly.
- You've wired up all the connections that the visualization needs. Well done!
- The visualization appears to be functioning correctly.

## Loading Screens
Here's the [template](loadingTemplate.html), and these are the messages:
- Still accessing this project's datasets...
- Still accessing this project's matching settings...
- Still attempting to render the visualization...

## User Error Screens
The idea behind this screen is the user still needs to do something for something to work (the user should be able to fix these on their own). Here's the [template](userErrorTemplate.html), and these are the messages, broken down by panels:

#### Dataset panel
- You have not chosen a dataset yet. Click <a>here</a> to choose one.
- There was a problem parsing the data; you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.
- There was a problem parsing the data. Specifically, we\'re having trouble understanding the dataset attributes (usually column headers); you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.

#### Matching panel
- You need to choose both a Dataset and a Visualization in order to connect them together.
- The visualization needs more connections to data in order to display anything.

#### Visualization panel
- You have not chosen a visualization yet. Click <a>here</a> to choose one.
- This visualization needs more data matchings. Make sure there are no orange warning triangles in the Matching panel.

## Regular Error Screens
The idea behind these screens is that some kind of error has happened, but it's one that we know about, and it's supposed to happen (the user may or may not be able to fix these on their own). Here's the [template](errorTemplate.html), and these are the messages:
- You don\'t have the necessary permissions to delete that project.
- Sorry, you can\'t delete projects unless you log in.
- The dataset could not be loaded; there is a good chance that there is a permissions problem.

## System Failure Screens
The idea behind these screens is something really bad happened—something that we didn't anticipate. So we have a [template](reallyBadErrorTemplate.html), but the messages and details will probably be really cryptic.

# Notifications
These show up as little notifications in the bottom corner that the user can close, or they automatically fade after a while; they're either yellow or orange, depending on whether they're regular messages, or if they're indicating a warning.
- You are now working on a copy of this project in the public scratch space. Log in to take ownership of this project.
- You are now working on a copy of this project in your Private folder.
- You are now working with a copy of the <dataset name> dataset, stored in your Private folder.
- You are now working with a copy of the <dataset name> dataset, stored in the public scratch space. Log in to take ownership of this dataset.
- Moved # of # projects that you were working on when you were logged out to your Private folder
- Moved # of # datasets that you were working on when you were logged out to your Private folder
- Could not restore datasets from when you were logged out
- Could not restore projects from when you were logged out
- Link successfully copied to clipboard
- Sorry, couldn\'t copy the link for some reason. Try copying this page\'s URL from your browser\'s address bar instead.

# Tips
When the user clicks one of the question mark buttons, these messages show up in yellow bubbles with an arrow pointing to somewhere on the screen (this list is incomplete; let me know if you'd like an exhaustive one):
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
- ...

# Dataset Overview
These are the ways that the overview is explained:
- Visualizing all # items in the dataset.
- Visualizing items # - # of # total items.
- Visualizing # items of the # total items in the dataset.
- Visualizing items # - # of # filtered items. There are # total items
in the dataset (ignoring filters).
