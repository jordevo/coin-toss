import React, { useState } from "react";
import styled from "styled-components";
import "./App.css";

const COIN_STATE = { HEADS: "heads", TAILS: "tails" };

const TossButton = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid darkgray;
  color: darkgray;
  font-size: 1em;
  margin: 0.5em 1em;
  outline: none;
  padding: 1em 4em;
`;

const HeadsTailsCounter = styled.div`
  display: flex;
  color: darkgray;
  justify-content: space-around;
  width: 100%;
`;

function App() {
  const [coinState, setCoinState] = useState(COIN_STATE.HEADS);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const getNextState = () => {
    const nextState = Math.random() < 0.5 ? COIN_STATE.HEADS : COIN_STATE.TAILS;
    nextState === COIN_STATE.HEADS
      ? setHeadsCount(headsCount + 1)
      : setTailsCount(tailsCount + 1);
    setCoinState(nextState);
  };

  return (
    <div className="App">
      <section className="App-content">
        <div className="flip-container">
          <div className="flipper">
            <div className="front"></div>
            <div className="back"></div>
          </div>
        </div>
        <TossButton onClick={getNextState}>Coin Toss</TossButton>
        {headsCount || tailsCount ? <h4>You got {coinState}</h4> : <></>}
        <HeadsTailsCounter>
          <div>
            <h4>Heads</h4>
            <p>{headsCount}</p>
          </div>
          <div>
            <h4>Tails</h4>
            <p>{tailsCount}</p>
          </div>
        </HeadsTailsCounter>
      </section>
    </div>
  );
}

export default App;
