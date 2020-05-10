import React, { Component } from "react";
import classnames from "classnames";
import { AppContext } from "../Context/Context";
import "./Favorites.css";
import Spinner from "../Spinner/Spinner";

export default class Favorites extends Component {
  numberFormat = (number) => {
    return +(number + "").slice(0, 7);
  };

  render() {
    return (
      <AppContext.Consumer>
        {({ pricesDataArray, removeFavorites }) => {
          let localStorageFavorites =
            JSON.parse(localStorage.getItem("favoritesCoins")) || [];

          return (
            <div className="favorites">
              <div className="favorites-title">
                <h1 className="favorite-title__name">Favorites</h1>
              </div>

              <div className="favorites-info">
                {localStorageFavorites.length === 0 ? (
                  <h4>You don't have any favorites, please go select some.</h4>
                ) : localStorageFavorites.length > 1 &&
                  pricesDataArray.length > 1 ? (
                  pricesDataArray.map((coin) => {
                    return (
                      <div
                        className="favorites__container"
                        key={coin[Object.keys(coin)].USD.FROMSYMBOL}
                        onClick={() => removeFavorites(coin)}
                      >
                        <div className="favorites__single">
                          <span>{coin[Object.keys(coin)].USD.FROMSYMBOL}</span>
                          <span
                            className={classnames(
                              `${
                                this.numberFormat(
                                  coin[Object.keys(coin)].USD.CHANGEPCT24HOUR
                                ) < 0
                                  ? "favorites__price--red"
                                  : "favorites__price--green"
                              }`
                            )}
                          >
                            {this.numberFormat(
                              coin[Object.keys(coin)].USD.CHANGEPCT24HOUR
                            )}
                            %
                          </span>
                        </div>
                        <h2>${coin[Object.keys(coin)].USD.PRICE}</h2>
                      </div>
                    );
                  })
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
