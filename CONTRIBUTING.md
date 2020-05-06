# Contribuiting

## Setting up

1. [Create a GitHub account](https://help.github.com/articles/signing-up-for-a-new-github-account/) if you don't already have one.
2. [Install and set up Git](https://help.github.com/articles/set-up-git/).

## Forkign

1. Create your own fork of the [gcloud-flutter-dota-app repository](https://github.com//alvarowolfx/gcloud-flutter-dota-app) by clicking "Fork" in the Web UI. During local development, this will be referred to by `git` as `origin`.

2. Download your fork to a local repository.

```shell
git clone git@github.com:<your username>/gcloud-flutter-dota-app.git
```

3. Add an alias called `upstream` to refer to the main `alvarowolfx/gcloud-flutter-dota-app` repository. Go to the root directory of the newly created local repository directory and run:

```shell
git remote add upstream git@github.com:alvarowolfx/gcloud-flutter-dota-app.git
```

4. Fetch data from the `upstream` remote:

```shell
git fetch upstream master
```

5. Set up your local `master` branch to track `upstream/master` instead of `origin/master` (which will rapidly become outdated).

```shell
git branch -u upstream/master master
```

## Branch (do this each time you want a new branch)

Create and go to the branch:

```shell
git checkout -b <branch name> master
```