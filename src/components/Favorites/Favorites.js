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
        {({
          pricesDataArray,
          favoritesCoinArrayNames,
          fetchingPrices,
          removeFavorites,
        }) => {
          return (
            <div className="favorites">
              <div className="favorites-title">
                <h1 className="favorite-title__name">Favorites</h1>
              </div>

              <div className="favorites-info">
                {pricesDataArray.length === 0 ? (
                  <h4>You don't have any favorites, please go select some</h4>
                ) : fetchingPrices ? (
                  <Spinner />
                ) : (
                  pricesDataArray.map((coin, index) => {
                    return (
                      <div
                        className="favorites__container"
                        key={
                          coin[favoritesCoinArrayNames[index]].USD.FROMSYMBOL
                        }
                        onClick={() => removeFavorites(coin)}
                      >
                        <div className="favorites__single">
                          <span>
                            {
                              coin[favoritesCoinArrayNames[index]].USD
                                .FROMSYMBOL
                            }
                          </span>
                          <span
                            className={classnames(
                              `${
                                this.numberFormat(
                                  coin[favoritesCoinArrayNames[index]].USD
                                    .CHANGEPCT24HOUR
                                ) < 0
                                  ? "favorites__price--red"
                                  : "favorites__price--green"
                              }`
                            )}
                          >
                            {this.numberFormat(
                              coin[favoritesCoinArrayNames[index]].USD
                                .CHANGEPCT24HOUR
                            )}
                            %
                          </span>
                        </div>
                        <h2>
                          ${coin[favoritesCoinArrayNames[index]].USD.PRICE}
                        </h2>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
