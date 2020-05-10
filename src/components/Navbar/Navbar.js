import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

export default class Navbar extends Component {
  render() {
    return (
      <header>
        <nav>
          <ul>
            <li>
              <NavLink activeClassName="active-navlink" to="/" exact>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active-navlink" to="/favorites" exact>
                Favorites
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
