import React, { Component } from "react";
import { AppContext } from "../Context/Context";
import _ from "lodash";
import "./Coins.css";

export default class Coins extends Component {
  prepareDataObj = (allCoins, favoritesCoinArrayNames) => {
    let filteredArray = allCoins.filter((coin1) => {
      return !favoritesCoinArrayNames.find((coin2) => coin1.Id === coin2.Id);
    });

    return filteredArray;
  };

  render() {
    return (
      <AppContext.Consumer>
        {({ allCoins, selectFavorites, favorites }) => {
          let allCoinsArray = [];

          if (favorites.length > 0) {
            let preparedDataObjArray = this.prepareDataObj(allCoins, favorites);

            allCoinsArray = preparedDataObjArray;
          } else {
            allCoinsArray = allCoins;
          }

          return (
            <div className="coins">
              <div className="coin-title">
                <h1 className="coin-title__name">Coins</h1>
              </div>

              <div className="coins__container">
                {allCoinsArray.map((coin) => {
                  return (
                    <div
                      className="coins__single"
                      key={coin.Name}
                      onClick={() => selectFavorites(coin)}
                    >
                      <div className="coin__single--logo">
                        <img
                          className="coin__image"
                          alt={coin.Name}
                          src={`http://cryptocompare.com/${coin.ImageUrl}`}
                        />
                      </div>
                      <h2>{coin.Name}</h2>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
