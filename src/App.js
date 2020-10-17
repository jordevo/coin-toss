import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Coin from "./Coin";
import "./App.css";

function App() {
  return (
    <div className="App">
      <section className="App-content">
        <Router>
          <Switch>
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
            <Route path="/">
              <></>
            </Route>
          </Switch>
        </Router>
      </section>
    </div>
  );
}

export default App;
