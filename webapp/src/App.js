import React from 'react';
import './App.css';

import Container from '@material-ui/core/Container'
import { BrowserRouter as Router,} from 'react-router-dom'

import Routes from './Routes'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'

import { useHeroesList } from './atoms/heroes'

function App() {
  useHeroesList()
  return (
    <Container>
      <Router>
        <Header/>
        <div style={{ marginTop : 72, marginBottom : 72 }}>
          <Routes/>
        </div>
        <TabNavigation/>
      </Router>
    </Container>
  );
}

export default App;
