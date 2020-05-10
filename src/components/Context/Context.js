import React, { Component } from "react";
import _ from "lodash";
import fuzzy from "fuzzy";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const AppContext = React.createContext();

export default class Context extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allCoins: null,
      handleSearchCoinSubmit: this.handleSearchCoinSubmit,
      selectFavorites: this.selectFavorites,
      removeFavorites: this.removeFavorites,
      allCoinsData: null,
      favorites: [],
      favoritesCoinArrayNames: [],
      pricesDataArray: [],
      undefinedDataArray: [],
    };
  }

  async componentDidMount() {
    this.getInitialCoins();
    this.checkIfFavoritesIsSavedInLocalStorage();
    this.fetchPrices();
  }

  fetchPrices = async () => {
    let getCoinsFromLocalStorage = JSON.parse(
      localStorage.getItem("favoritesCoins")
    );

    if (getCoinsFromLocalStorage && getCoinsFromLocalStorage.length >= 1) {
      try {
        let favoritesNameArray = getCoinsFromLocalStorage.map(
          (coin) => coin.Name
        );

        let resultsJson = await fetch(
          //https://sleepy-perlman-0d377e.netlify.app/
          "http://localhost:3001/api/coins/get-prices",
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(favoritesNameArray),
          }
        );
        let results = await resultsJson.json();

        this.setState({
          pricesDataArray: results.priceData,
          undefinedDataArray: results.undefinedData,
        });
      } catch (e) {
        toast.warn("Something went wrong try again!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  checkIfFavoritesIsSavedInLocalStorage = () => {
    let getCoinsFromLocalStorage = JSON.parse(
      localStorage.getItem("favoritesCoins")
    );

    if (getCoinsFromLocalStorage) {
      this.saveFavoritesArrayName(getCoinsFromLocalStorage);
      this.setState({
        favorites: getCoinsFromLocalStorage,
      });
    }
  };

  getInitialCoins = async () => {
    try {
      let results = await fetch(
        "http://localhost:3001/api/coins/get-all-coins"
      );
      let fetchedCoins = await results.json();
      let data = fetchedCoins.coinList.Data;

      let dataArray = this.transferCoins(data);

      this.setState({
        allCoins: dataArray,
        allCoinsData: data,
      });
    } catch (error) {
      toast.warn("Something went wrong try again!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  transferCoins(coinList, fromSearchBar) {
    let coinArray = [];
    for (var key in coinList) {
      coinArray.push(coinList[key]);
    }

    if (fromSearchBar) {
      return coinArray.slice(0);
    } else {
      return coinArray.slice(0, 100);
    }
  }

  handleSearchCoinSubmit = async (searchTerm) => {
    this.handleFilterCoins(searchTerm);
  };

  handleFilterCoins = (searchTerm) => {
    const { allCoinsData } = this.state;
    let coinSymbols = Object.keys(allCoinsData);

    let coinNames = coinSymbols.map((sym) => allCoinsData[sym].CoinName);
    let allStringsToSearch = coinSymbols.concat(coinNames);
    let fuzzyResults = fuzzy
      .filter(searchTerm, allStringsToSearch, {})
      .map((result) => result.string);

    let filteredCoins = _.pickBy(allCoinsData, (result, symKey) => {
      let coinName = result.CoinName;
      return (
        _.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName)
      );
    });
    this.handleFilteredCoins(filteredCoins);
  };

  handleFilteredCoins = (filteredCoins) => {
    let foundCoin = Object.keys(filteredCoins).length;

    if (foundCoin > 1) {
      let coinArray = this.transferCoins(filteredCoins, true);

      this.setState({
        allCoins: coinArray.reverse(),
      });
    } else {
      toast.warn(
        "Sorry! The Coin you are search does not exist. Please try another coin",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  saveToFavorite = (favorites) => {
    let newFavorites = [...this.state.favorites, favorites];

    this.saveFavoriteToLocalStorage(newFavorites);
    this.saveFavoritesArrayName(newFavorites);
    this.fetchPrices();
    this.setState({
      favorites: newFavorites,
    });
  };

  filterFavoriteFromAllCoins = (favorite) => {
    const { allCoins } = this.state;

    const filterFavoriteFromAllCoins = allCoins.filter(
      (coin) => coin.Name !== favorite.Name
    );

    this.setState({
      allCoins: filterFavoriteFromAllCoins,
    });
  };

  selectFavorites = (favorites) => {
    if (this.state.favorites.length < 20) {
      this.saveToFavorite(favorites);
      this.filterFavoriteFromAllCoins(favorites);
    } else {
      toast.warn("Hey,You reached your limited 20 favorites! Sorry!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  saveFavoriteToLocalStorage = (favorites) => {
    localStorage.setItem("favoritesCoins", JSON.stringify(favorites));
  };

  saveFavoritesArrayName = (favorites) => {
    let favoritesNameArray = favorites.map((coin) => coin.Name);

    this.setState({
      favoritesCoinArrayNames: favoritesNameArray,
    });
  };

  removeFavorites = (deleteFavorites) => {
    const { favoritesCoinArrayNames, favorites, pricesDataArray } = this.state;

    let localStorageCoins = JSON.parse(localStorage.getItem("favoritesCoins"));

    let FilteredLocalStorageCoins = localStorageCoins.filter(
      (coin) => coin.Name !== Object.keys(deleteFavorites)[0]
    );

    let filteredPricesDataArray = pricesDataArray.filter(
      (coin) => Object.keys(coin)[0] !== Object.keys(deleteFavorites)[0]
    );

    let filteredFavoritesCoinArrayNames = favoritesCoinArrayNames.filter(
      (coin) => coin !== Object.keys(deleteFavorites)[0]
    );

    let filteredFavorites = favorites.filter(
      (coin) => coin.Name !== Object.keys(deleteFavorites)[0]
    );

    this.setState({
      favoritesCoinArrayNames: filteredFavoritesCoinArrayNames,
      favorites: filteredFavorites,
      pricesDataArray: filteredPricesDataArray,
    });
    localStorage.setItem(
      "favoritesCoins",
      JSON.stringify(FilteredLocalStorageCoins)
    );
  };

  render() {
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AppContext.Provider value={this.state}>
          {this.props.children}
        </AppContext.Provider>
      </>
    );
  }
}
