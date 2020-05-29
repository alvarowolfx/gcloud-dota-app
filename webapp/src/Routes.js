import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Heroes from './pages/Heroes'
import TeamBuilder from './pages/TeamBuilder'

export default function Routes() {
  return (
    <Switch>
      <Route path="/heroes">
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