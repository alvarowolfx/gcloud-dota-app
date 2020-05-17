# Dota 2 App using Flutter, Firebase and Google Cloud

This is a pet project that born with the idea of having a nice subject to go through some Live Coding sessions. We are getting data from [DotaBuff](https://dotabuff.com) website to have more info about the heroes and latest matches.

<img src="https://github.com/alvarowolfx/gcloud-flutter-dota-app/raw/master/.images/screenshot01.jpeg" width="20%" height="20%" /> <img src="https://github.com/alvarowolfx/gcloud-flutter-dota-app/raw/master/.images/screenshot02.jpeg" width="20%" height="20%" /> <img src="https://github.com/alvarowolfx/gcloud-flutter-dota-app/raw/master/.images/screenshot03.jpeg" width="20%" height="20%" />

That info is going to be used on the Flutter app to build different features, some of them are :

* Show which heroes are good/bad against a given hero.
* Show a rank of best heroes
* Build both match teams and get recommendations while heroes are being picked.

Also we are going to build a Voice integration that will allow to access some of those same features from the app.

The live codings session happens in Portuguese (PT-BR) and you can follow on my Youtube/Twitch channels.

* [Alvaro Viebrantz on Youtube](https://youtube.com/alvaroviebrantz)
* [Alvaro Viebrantz on Twitch](https://twitch.tv/alvaroviebrantz)

# Table of Contents

- [Dota 2 App using Flutter, Firebase and Google Cloud](#dota-2-app-using-flutter-firebase-and-google-cloud)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Node Setup](#node-setup)
  - [Firebase Setup](#firebase-setup)
  - [Google Cloud Tools and Project](#google-cloud-tools-and-project)
  - [Flutter Setup](#flutter-setup)
  - [Building & Running the project](#building--running-the-project)

# Getting Started

## Node Setup

* Install the latest LTS version of [Node.js](https://nodejs.org/) (which includes npm). An easy way to do so is with `nvm`. (Mac and Linux: [here](https://github.com/creationix/nvm), Windows: [here](https://github.com/coreybutler/nvm-windows))

```shell
nvm install --lts
```

## Firebase Setup

* Install the [Firebase CLI](https://firebase.google.com/docs/cli) via `npm`. The following command enables the globally available `firebase` command:

```shell
npm install -g firebase-tools
```

* After installing the CLI, you must authenticate. Then you can confirm authentication by listing your Firebase projects. Sign into Firebase using your Google account by running the following command:

```shell
firebase login
```

* Test that the CLI is properly installed and accessing your account by listing your Firebase projects. Run the following command:

```shell
firebase projects:list
```

## Google Cloud Tools and Project

* Install gcloud [CLI](https://cloud.google.com/sdk/install)
* Authenticate with Google Cloud:
    * `gcloud auth login`
* Create cloud project — choose your unique project name:
    * `gcloud projects create YOUR_PROJECT_NAME`
* Set current project
    * `gcloud config set project YOUR_PROJECT_NAME`
* Set current project
    * `firebase use YOUR_PROJECT_NAME`

## Flutter Setup

* Follow the guide on their [website](https://flutter.dev/docs/get-started/install).
* Run the following command to make sure it's all good.
```shell
flutter doctor
```

## Building & Running the project

* Make sure you have the latest packages (after you pull): `npm install`
* Deploy all the function from the `functions` directory.
  * There are deploy scripts on the `package.json` file.
* To run the app, run `flutter run` on the `dota_app` folder
