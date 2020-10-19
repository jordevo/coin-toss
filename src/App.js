import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Coin } from "./Coin";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <section className="App-content">
          <Route exact path="/coin/seventails">
            <Coin sevenTails />
          </Route>
          <Route exact path="/coin">
            <Coin />
          </Route>
          <Route exact path="/trump/seventails">
            <Coin sevenTails showTrump />
          </Route>
          <Route exact path="/trump">
            <Coin showTrump />
          </Route>
          <Route exact path="/shapes/seventails">
            <Coin sevenTails showShapes />
          </Route>
          <Route exact path="/shapes">
            <Coin showShapes />
          </Route>
          <Route path="/" component={() => <></>} />
        </section>
      </div>
    </Router>
  );
}

export default App;
