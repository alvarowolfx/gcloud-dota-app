import React from 'react';
import './App.css';

//import { BrowserRouter as Router } from 'react-router-dom'
import { Router } from "react-router"
import { createBrowserHistory } from "history"

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Routes from './Routes'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'

import { useHeroesList } from './atoms/heroes'
import { useNavigation } from './atoms/navigation'

const history = createBrowserHistory()

function App() {
  useHeroesList()
  useNavigation(history)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <div>
      <Router history={history}>
        <Header/>
        <div style={{ marginTop : isMobile ? 56 : 64, marginBottom : 72 }}>
          <Routes/>
        </div>
        <TabNavigation/>
      </Router>
    </div>
  );
}

export default App;
