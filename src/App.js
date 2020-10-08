import React, { useState } from "react";
import styled from "styled-components";
import "./App.css";
import {
  keyframesFrontFlip,
  keyframesFrontHalfFlip,
  keyframesBackFlip,
  keyframesBackHalfFlip,
  timingFlip,
  timingHalfFlip,
} from "./animations";

const COIN_HEADS_ID = "coin-heads-test";
const COIN_TAILS_ID = "coin-tails-test";

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

const ResultNotification = styled.div`
  display: flex;
  height: 40px;
  justify-content: center;
  width: 100%;

  h4 {
    margin: auto;
  }
`;

function App() {
  const [coinState, setCoinState] = useState(COIN_STATE.HEADS);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const tossCoin = () => {
    setIsAnimating(true);
    const nextState = Math.random() < 0.5 ? COIN_STATE.HEADS : COIN_STATE.TAILS;
    const willFlip = coinState !== nextState;

    let COIN_FRONT_ID = COIN_HEADS_ID;
    let COIN_BACK_ID = COIN_TAILS_ID;

    if (coinState === COIN_STATE.TAILS) {
      COIN_FRONT_ID = COIN_TAILS_ID;
      COIN_BACK_ID = COIN_HEADS_ID;
    }

    const coinFront = document.querySelector(`#${COIN_FRONT_ID}`);
    const coinBack = document.querySelector(`#${COIN_BACK_ID}`);

    const animation = coinFront.animate(keyframesFrontFlip, timingFlip);
    coinBack.animate(keyframesBackFlip, timingFlip);

    animation.onfinish = () => {
      if (willFlip) {
        const flipAnimation = coinFront.animate(
          keyframesFrontHalfFlip,
          timingHalfFlip
        );
        coinBack.animate(keyframesBackHalfFlip, timingHalfFlip);
        flipAnimation.onfinish = () => {
          setCoinState(nextState);
          setIsAnimating(false);
          nextState === COIN_STATE.HEADS
            ? setHeadsCount(headsCount + 1)
            : setTailsCount(tailsCount + 1);
        };
      } else {
        setCoinState(nextState);
        setIsAnimating(false);
        nextState === COIN_STATE.HEADS
          ? setHeadsCount(headsCount + 1)
          : setTailsCount(tailsCount + 1);
      }
    };
  };

  const _getZ = (side) => Number(Boolean(side === coinState));

  return (
    <div className="App">
      <section className="App-content">
        <div className="coin-container">
          <div
            className="coin-heads-test"
            id="coin-heads-test"
            style={{ zIndex: 2 * _getZ(COIN_STATE.HEADS) }}
          ></div>
          <div
            className="coin-tails-test"
            id="coin-tails-test"
            style={{ zIndex: 2 * _getZ(COIN_STATE.TAILS) }}
          ></div>
        </div>
        <TossButton onClick={tossCoin}>Coin Toss</TossButton>
        <ResultNotification>
          {(headsCount || tailsCount) && !isAnimating ? (
            <h4>You got {coinState}</h4>
          ) : (
            <></>
          )}
        </ResultNotification>
        {false && ( // no need to display heads / tails counter for now
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
        )}
      </section>
    </div>
  );
}

export default App;
