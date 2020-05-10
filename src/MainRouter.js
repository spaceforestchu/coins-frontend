import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
const Home = React.lazy(() => import("./components/Home/Home"));
const Favorites = React.lazy(() => import("./components/Favorites/Favorites"));
const NotFound = React.lazy(() => import("./components/NotFound/NotFound"));

export default class MainRouter extends Component {
  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/favorites" component={Favorites} />
          <Route exact component={NotFound} />
        </Switch>
      </>
    );
  }
}
