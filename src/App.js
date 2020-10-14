import React, { useEffect, useReducer, useRef } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import cx from "classnames";
import styled from "styled-components";
import "./App.css";
import {
  keyframesFrontFlip,
  keyframesFrontHalfFlip,
  keyframesBackFlip,
  keyframesBackHalfFlip,
  timingFlip,
  timingHalfFlip,
  timingFastFlip,
  timingHalfFastFlip,
} from "./animations";

import { ACTIONS, COIN_STATE, INITIAL_STATE, reducer } from "./reducer";

const COIN_HEADS_ID = "coin-heads-test";
const COIN_TAILS_ID = "coin-tails-test";

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

const ResultsConsole = styled.div`
  color: darkgray;
  height: 240px;
  margin: 0.5em 1em;
  overflow-y: scroll;
  padding: 0.5em;
  text-align: left;
  text-transform: uppercase;
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
  const resultsConsoleElement = useRef(null);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (!state.tossCoin || state.isAnimating) return;

    const timing = state.isAnimatingFast ? timingFastFlip : timingFlip;
    const timingHalf = state.isAnimatingFast
      ? timingHalfFastFlip
      : timingHalfFlip;

    const nextState = Math.random() < 0.5 ? COIN_STATE.HEADS : COIN_STATE.TAILS;
    const willFlip = state.coinState !== nextState;

    nextState === COIN_STATE.HEADS
      ? dispatch({ type: ACTIONS.HEADS_COUNT_INCREMENT })
      : dispatch({ type: ACTIONS.TAILS_COUNT_INCREMENT });

    let COIN_FRONT_ID = COIN_HEADS_ID;
    let COIN_BACK_ID = COIN_TAILS_ID;

    if (state.coinState === COIN_STATE.TAILS) {
      COIN_FRONT_ID = COIN_TAILS_ID;
      COIN_BACK_ID = COIN_HEADS_ID;
    }

    const coinFront = document.querySelector(`#${COIN_FRONT_ID}`);
    const coinBack = document.querySelector(`#${COIN_BACK_ID}`);

    if (!state.isAnimating) {
      const animation = coinFront.animate(keyframesFrontFlip, timing);
      coinBack.animate(keyframesBackFlip, timing);

      animation.onfinish = () => {
        if (willFlip) {
          const flipAnimation = coinFront.animate(
            keyframesFrontHalfFlip,
            timingHalf
          );
          coinBack.animate(keyframesBackHalfFlip, timingHalf);
          flipAnimation.onfinish = () => {
            dispatch({ type: ACTIONS.TOSS_COIN_RESET });
            dispatch({ type: ACTIONS.ANIMATION_STOPS });
            dispatch({ type: ACTIONS.RESET_ANIMATION_FAST });
          };
        } else {
          dispatch({ type: ACTIONS.TOSS_COIN_RESET });
          dispatch({ type: ACTIONS.ANIMATION_STOPS });
          dispatch({ type: ACTIONS.RESET_ANIMATION_FAST });
        }
      };
      dispatch({ type: ACTIONS.ANIMATION_STARTS });
    }

    dispatch({ type: ACTIONS.COIN_STATE_UPDATE, payload: nextState });
    dispatch({
      type: ACTIONS.RESULTS_UPDATE,
      payload: state.results.concat([nextState]),
    });
  }, [
    state.coinState,
    state.isAnimatingFast,
    state.isAnimating,
    state.tossCoin,
    state.results,
  ]);

  const _getZ = (side) => Number(Boolean(side === state.coinState));

  useEffect(() => {
    if (!state.tossCoinUntilTails || state.isAnimating || state.isAnimatingFast)
      return;
    const lastResults = state.results.slice(-state.numberOfTailsToStop);
    if (
      lastResults.filter((toss) => toss === COIN_STATE.TAILS).length ===
      state.numberOfTailsToStop
    ) {
      dispatch({ type: ACTIONS.TOSS_COIN_UNTIL_TAILS_RESET });
      dispatch({
        type: ACTIONS.SUCCESS_MESSAGE_UPDATE,
        payload: `You got it! it took ${state.results.length} tosses.`,
      });
      dispatch({
        type: ACTIONS.CONSOLE_MESSAGE_UPDATE,
        payload: state.results.join(", "),
      });
    } else {
      dispatch({ type: ACTIONS.SET_ANIMATION_FAST });
      dispatch({ type: ACTIONS.TOSS_COIN });
    }
  }, [
    state.isAnimating,
    state.isAnimatingFast,
    state.numberOfTailsToStop,
    state.results,
    state.tossCoinUntilTails,
  ]);

  useEffect(() => {
    if (!state.tossCoinUntilTails && state.results.length === 1) {
      dispatch({
        type: ACTIONS.SUCCESS_MESSAGE_UPDATE,
        payload: `You got ${state.coinState}.`,
      });
    }
  }, [state.coinState, state.results, state.tossCoinUntilTails]);

  useEffect(() => {
    if (state.results.length > 1) {
      dispatch({
        type: ACTIONS.CONSOLE_MESSAGE_UPDATE,
        payload: state.results.join(", "),
      });
      resultsConsoleElement.current.scrollTop =
        resultsConsoleElement.current.scrollHeight;
    }
  }, [state.results]);

  const _getCoin = ({ sevenTails = false, showTrump = false } = {}) => {
    return (
      <>
        <div className="coin-container">
          <div
            className={cx("coin-heads-test", { "coin-heads-trump": showTrump })}
            id="coin-heads-test"
            style={{ zIndex: 2 * _getZ(COIN_STATE.HEADS) }}
          ></div>
          <div
            className={cx("coin-tails-test", { "coin-tails-trump": showTrump })}
            id="coin-tails-test"
            style={{ zIndex: 2 * _getZ(COIN_STATE.TAILS) }}
          ></div>
        </div>
        <div className="buttons-container">
          <TossButton
            onClick={() => {
              dispatch({ type: ACTIONS.CONSOLE_MESSAGE_RESET });
              dispatch({ type: ACTIONS.SUCCESS_MESSAGE_RESET });
              dispatch({ type: ACTIONS.RESULTS_RESET });
              dispatch({ type: ACTIONS.HEADS_COUNT_RESET });
              dispatch({ type: ACTIONS.TAILS_COUNT_RESET });
              dispatch({ type: ACTIONS.TOSS_COIN });
            }}
          >
            Coin Toss
          </TossButton>
          {sevenTails && (
            <TossButton
              onClick={() => {
                dispatch({ type: ACTIONS.CONSOLE_MESSAGE_RESET });
                dispatch({ type: ACTIONS.SUCCESS_MESSAGE_RESET });
                dispatch({ type: ACTIONS.RESULTS_RESET });
                dispatch({ type: ACTIONS.HEADS_COUNT_RESET });
                dispatch({ type: ACTIONS.TAILS_COUNT_RESET });
                dispatch({ type: ACTIONS.TOSS_COIN_UNTIL_TAILS });
              }}
            >
              Toss Until 7 Tails in a Row
            </TossButton>
          )}
        </div>
        <ResultNotification>
          {(state.headsCount || state.tailsCount) && !state.isAnimating ? (
            <h4>{state.successMessage}</h4>
          ) : (
            <></>
          )}
        </ResultNotification>
        {sevenTails && (
          <ResultsConsole ref={resultsConsoleElement}>
            {state.consoleMessage}
          </ResultsConsole>
        )}
      </>
    );
  };

  return (
    <div className="App">
      <section className="App-content">
        <Router basename="/">
          <Switch>
            <Route path="/seventails">
              {() => _getCoin({ sevenTails: true })}
            </Route>
            <Route path="/trump/seventails">
              {() => _getCoin({ showTrump: true, sevenTails: true })}
            </Route>
            <Route path="/trump">{() => _getCoin({ showTrump: true })}</Route>
            <Route path="/">{() => _getCoin()}</Route>
          </Switch>
        </Router>
      </section>
    </div>
  );
}

export default App;
