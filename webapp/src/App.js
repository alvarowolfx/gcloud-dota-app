import React from 'react';
import './App.css';

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Routes from './Routes'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'

import { useHeroesList } from './atoms/heroes'
import { NavigationRouter } from './atoms/navigation'

function App() {
  useHeroesList()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <div className="App">
      <NavigationRouter>
        <Header/>
        <div className="AppContainer" style={{
          marginTop : isMobile ? 56 : 64,
          //marginBottom : 56,
          paddingBottom : 56*2,
          //paddingTop : isMobile ? 56 : 64,
          overflow : 'hidden',
          height : '100%'
        }}>
          <Routes/>
          <TabNavigation/>
        </div>
      </NavigationRouter>
    </div>
  );
}

export default App;
