import React from 'react';
import './App.css';

import Container from '@material-ui/core/Container'
import { BrowserRouter as Router,} from 'react-router-dom'

import Routes from './Routes'
import Header from './components/Header'

function App() {
  return (
    <Container>
      <Router>
        <Header/>
        <Routes/>
      </Router>
    </Container>
  );
}

export default App;
