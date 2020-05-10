import React, { Component } from "react";
import Search from "../Search/Search";
import Coins from "../Coins/Coins";
import { AppContext } from "../Context/Context";
import Spinner from "../Spinner/Spinner";

export default class Home extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ allCoins }) => {
          return (
            <>
              <Search />
              {allCoins === null ? <Spinner /> : <Coins />}
            </>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
