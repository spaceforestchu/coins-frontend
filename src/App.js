import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Spinner from "./components/Spinner/Spinner";
import "./App.css";
import MainRouter from "./MainRouter";
import Context from "./components/Context/Context";
function App() {
  return (
    <Context>
      <Router>
        <React.Suspense fallback={<Spinner />}>
          <MainRouter />
        </React.Suspense>
      </Router>
    </Context>
  );
}

export default App;
