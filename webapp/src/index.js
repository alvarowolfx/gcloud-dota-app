import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import {
  RecoilRoot
} from 'recoil'

import "firebase/database"
import * as firebase from "firebase/app"

import theme from './theme'
import App from './App';
import * as serviceWorker from './serviceWorker';

const firebaseConfig = require('./firebase-config.json')
firebase.initializeApp(firebaseConfig)

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
