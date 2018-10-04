# Contributing to Candela

Candela is an open-source project and therefore relies on your contributions in
conjunction with the efforts of the core developer team to grow and improve. You
can contribute to Candela in many ways, not all of them involving writing code.
We recommend the following checklist of ways you can help:

   * Read the [Candela documentation](http://candela.readthedocs.io/en/latest/)
     to become familiar with usage and development of the library. If the
     documentation is unclear or can be improved in some way, please let us
     know.

   * Submit a feature request or bug report on the [Candela issue
     tracker](https://github.com/Kitware/candela/issues).

   * Submit a [pull request](https://github.com/Kitware/candela/pulls) to add a
     feature or fix a bug.

## Creating and submitting a pull request

Candela development generally uses the "fork and pull" model for contributors
without push access to the main repository, and the "shared repository" model
for those who do. The general procedure for creating a pull request is as
follows:

   1. Fork the Candela repository to your own account, and then clone it (or, if
      you have push access to the main repository, clone that instead).

   2. Create a topic branch that will serve as the basis for your pull request.

   3. Make commits (following the [Commitizen-friendly guidelines]() below in
      crafting the commit messages) to implement your bugfix, feature, or other
      update.

   4. Push your commits.

   5. Open a pull request against the main repository's `master` branch.

   6. Work with the core developers to address concerns, pass tests, and ensure
      that everything is working as it should.

   7. Once the pull request is approved by a core developer, the pull request
      can be merged to master.

      If you have push access: hit the big green "merge button". Yay!

      If you do not: a core developer will press the button. Woo hoo!

## Testing

The Candela GitHub repository is configured to run Candela's testing suite via
Circle on all pushes and pull requests. This gives us a quick sanity check
before we merge a pull request. There are two kinds of test: unit tests to
stress basic functionality in the library itself (such as features of Candela
that don't rely on visual output, or utilities that support such features) and
image tests to instantiate a visualization component and compare it to a
baseline.

### Running the test suite locally

You can and should run the testing suite locally when working on your own pull
request.  To do so, issue the following commands after building your local
version of Candela from source:

    $ npm run test
    $ npm run test:image

Running these commands provides a formatted test report that will show you if
any unit tests fail or if any of the testing images do not match a baseline.

Keep in mind that different systems may render the testing images slightly
differently due to factors that are difficult to control for. If any image test
fails, you may want to manually view the testing image, the baseline, and the
diff image side-by-side to verify what happened.

### Running the test suite via Circle

The Candela repository is pre-configured to run tests on Circle on every push,
including those coming from forked Candela repositories.  That is, whenever you
push a branch or create a pull request, GitHub will show you the results of
these tests.

## Semantic Release and commit messages

Candela uses [Semantic
Release](https://github.com/semantic-release/semantic-release) to create
automated release packages of Candela. It works by analyzing the commit messages
on any branch that is merged to master, deciding based on their content whether
a new release is mandated by the commits, and if so, what version number to use
for that package.

The commit messages themselves have a fairly simple structure. In short, the
messages are use the [Angular commit message
guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
Each commit message has the following structure:

````
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
````

The `type` and `subject` are required; `type` must be one of:

   * `feat`: A new feature

   * `fix`: A bug fix

   * `docs`: Documentation only changes

   * `style`: Changes that do not affect the meaning of the code (white-space,
     formatting, missing semi-colons, etc)

   * `refactor`: A code change that neither fixes a bug nor adds a feature

   * `perf`: A code change that improves performance

   * `test`: Adding missing tests or correcting existing tests

   * `build`: Changes that affect the build system or external dependencies
     (example scopes: gulp, broccoli, npm)

   * `ci`: Changes to our CI configuration files and scripts (example scopes:
     Travis, Circle, BrowserStack, SauceLabs)

   * `chore`: Other changes that don't modify src or test files

`body` and `footer` are optional. See the [Angular
documentation](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)
for more details.

### Commitizen

At first it may seem burdensome to have to write commit messages this way.
However, after writing a few you will find that it is simpler than it seems. A
tool called [Commitizen](https://commitizen.github.io/cz-cli/) can help by
offering a menu-based system for creating commits.

Using Commitizen is completely optional, but it may help you get into the swing
of things. Installing it is relatively easy:

    $ npm install -g commitizen

After installation succeeds, you can use `git cz` as a drop-in replacement for
`git commit`, with the exact same options and flags you are used to.

If you don't want to install Commitizen globally on your system this way, you
can use an NPM script to run it out of Candela's `node_modules` directory by
saying `npm run commit` instead. To pass arguments along to `git-cz`, supply
them after a double dash; e.g., `npm run commit -- -a` to commit all changes in
the working tree.

### Commit message validation and retrying failed commits

The Candela repository has built-in validation for commit messages. If you
attempt a commit with an incorrectly formatted message, the commit will fail
with a message describing what went wrong. Git generally stores the last commit
message - whether the commit succeeded or not - in `.git/COMMIT_EDITMSG`. So, to
retry a commit whose message didn't validate, you can issue this command:

    $ git commit -t .git/COMMIT_EDITMSG

to fire up an editor containing the old message. You can then edit it and try
again.
