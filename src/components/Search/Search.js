import React, { Component } from "react";
import { AppContext } from "../Context/Context";

import "./Search.css";

export default class Search extends Component {
  state = {
    searchCoin: "",
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <AppContext.Consumer>
        {({ handleSearchCoinSubmit }) => {
          return (
            <div className="search">
              <div className="search__container">
                <input
                  type="text"
                  className="search__input"
                  placeholder="Find Coin"
                  name="searchCoin"
                  onChange={this.onChange}
                  value={this.state.searchCoin}
                  onKeyPress={(event) => {
                    var code = event.keyCode || event.which;
                    if (code === 13) {
                      handleSearchCoinSubmit(this.state.searchCoin);
                      this.setState({ searchCoin: "" });
                    }
                  }}
                />
              </div>
              <div className="search__button__container">
                <button
                  className="search__button"
                  onClick={() => {
                    handleSearchCoinSubmit(this.state.searchCoin);
                    this.setState({ searchCoin: "" });
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
