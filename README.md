# gcloud-flutter-dota-app


# Table of Contents

- [Getting Started](#getting-started)
  - [One-time Setup](#one-time-setup)
  - [Branch](#branch-do-this-each-time-you-want-a-new-branch)
  - [Building & Running](#building-&-running-the-project)

# Getting Started

## One-time Setup

1. [Create a GitHub account](https://help.github.com/articles/signing-up-for-a-new-github-account/) if you don't already have one.
2. [Install and set up Git](https://help.github.com/articles/set-up-git/).
3. Install the latest LTS version of [Node.js](https://nodejs.org/) (which includes npm). An easy way to do so is with `nvm`. (Mac and Linux: [here](https://github.com/creationix/nvm), Windows: [here](https://github.com/coreybutler/nvm-windows))

   ```shell
   nvm install --lts
   ```
4. Install the [Firebase CLI](https://firebase.google.com/docs/cli) via `npm`. The following command enables the globally available `firebase` command:

   ```shell
   npm install -g firebase-tools
   ```
5. After installing the CLI, you must authenticate. Then you can confirm authentication by listing your Firebase projects. Sign into Firebase using your Google account by running the following command:

   ```shell
   firebase login
   ```
6. Test that the CLI is properly installed and accessing your account by listing your Firebase projects. Run the following command:

   ```shell
   firebase projects:list
   ```
7. Create your own fork of the [gcloud-flutter-dota-app repository](https://github.com//alvarowolfx/gcloud-flutter-dota-app) by clicking "Fork" in the Web UI. During local development, this will be referred to by `git` as `origin`.

8. Download your fork to a local repository.

   ```shell
   git clone git@github.com:<your username>/gcloud-flutter-dota-app.git
   ```

9. Add an alias called `upstream` to refer to the main `alvarowolfx/gcloud-flutter-dota-app` repository. Go to the root directory of the
   newly created local repository directory and run:

   ```shell
   git remote add upstream git@github.com:alvarowolfx/gcloud-flutter-dota-app.git
   ```

10. Fetch data from the `upstream` remote:

   ```shell
   git fetch upstream master
   ```

11. Set up your local `master` branch to track `upstream/master` instead of `origin/master` (which will rapidly become
   outdated).

   ```shell
   git branch -u upstream/master master
   ```

## Branch (do this each time you want a new branch)

Create and go to the branch:

```shell
git checkout -b <branch name> master
```

## Building & Running the project

1. Make sure you have the latest packages (after you pull): `npm install`

