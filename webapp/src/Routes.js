import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Heroes from './pages/Heroes'
import Hero from './pages/Hero'
import TeamBuilder from './pages/TeamBuilder'

export default function Routes() {
  return (
    <Switch>
      <Route path="/heroes/:heroId">
        <Hero />
      </Route>
      <Route path="/heroes" exact>
        <Heroes />
      </Route>
      <Route path="/builder">
        <TeamBuilder />
      </Route>
      <Route path="/">
        <Redirect to="/heroes" />
      </Route>
    </Switch>
  );
}