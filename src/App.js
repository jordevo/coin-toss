import React, { useCallback, useEffect, useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
  overflow: scroll-y;
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
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const tossCoin = useCallback(
    ({
      fast = false,
      numberOfTailsToStop = INITIAL_STATE.numberOfTailsToStop,
    } = {}) => {
      dispatch({
        type: ACTIONS.STOP_AFTER_N_TAILS,
        payload: numberOfTailsToStop,
      });
      dispatch({ type: ACTIONS.ANIMATION_STARTS });

      const timing = fast ? timingFastFlip : timingFlip;
      const timingHalf = fast ? timingHalfFastFlip : timingHalfFlip;

      const nextState =
        Math.random() < 0.5 ? COIN_STATE.HEADS : COIN_STATE.TAILS;
      const willFlip = state.coinState !== nextState;

      dispatch({ type: ACTIONS.COIN_STATE_UPDATE, payload: nextState });
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

      const animation = coinFront.animate(keyframesFrontFlip, timing);
      coinBack.animate(keyframesBackFlip, timing);

      animation.onfinish = () => {
        if (willFlip) {
          const flipAnimation = coinFront.animate(
            keyframesFrontHalfFlip,
            timingHalf
          );
          coinBack.animate(keyframesBackHalfFlip, timingHalf);
          flipAnimation.onfinish = () =>
            dispatch({ type: ACTIONS.ANIMATION_STOPS });
        } else {
          return () => dispatch({ type: ACTIONS.ANIMATION_STOPS });
        }
      };
    },
    [state.coinState]
  );

  const tossUntilTails = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ANIMATION_FAST });
    return tossCoin({
      fast: state.isAnimatingFast,
      numberOfTailsToStop: state.numberOfTailsToStop,
    });
  }, [state.isAnimatingFast, state.numberOfTailsToStop, tossCoin]);

  const _getZ = (side) => Number(Boolean(side === state.coinState));

  useEffect(() => {
    if (state.numberOfTailsToStop === 0) {
      dispatch({
        type: ACTIONS.SUCCESS_MESSAGE_UPDATE,
        payload: `You got ${state.coinState}.`,
      });
    } else {
      const lastResults = state.results.slice(-state.numberOfTailsToStop);
      if (
        lastResults.filter((toss) => toss === COIN_STATE.TAILS).length ===
        state.numberOfTailsToStop
      ) {
        dispatch({ type: ACTIONS.STOP_TOSSING });
      } else {
        dispatch({ type: ACTIONS.KEEP_TOSSING });
      }
    }
    if (!state.isAnimating && state.keepTossing) {
      return tossUntilTails();
    }
    if (!state.isAnimating && !state.keepTossing && state.results.length > 1) {
      dispatch({
        type: ACTIONS.SUCCESS_MESSAGE_UPDATE,
        payload: `You got it! it took ${state.results.length} tosses.`,
      });
      dispatch({
        type: ACTIONS.RESULTS_RESET,
      });
    }
  }, [
    state.coinState,
    state.isAnimating,
    state.keepTossing,
    state.numberOfTailsToStop,
    state.results,
    tossUntilTails,
  ]);

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
              dispatch({ type: ACTIONS.SUCCESS_MESSAGE_RESET });
              dispatch({ type: ACTIONS.RESULTS_RESET });
              dispatch({ type: ACTIONS.HEADS_COUNT_RESET });
              dispatch({ type: ACTIONS.TAILS_COUNT_RESET });
              tossCoin();
            }}
          >
            Coin Toss
          </TossButton>
          {sevenTails && (
            <TossButton
              onClick={() => {
                dispatch({ type: ACTIONS.SUCCESS_MESSAGE_RESET });
                dispatch({ type: ACTIONS.RESULTS_RESET });
                dispatch({ type: ACTIONS.HEADS_COUNT_RESET });
                dispatch({ type: ACTIONS.TAILS_COUNT_RESET });
                tossUntilTails();
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
          <ResultsConsole>{state.results.join(", ")}</ResultsConsole>
        )}
      </>
    );
  };

  return (
    <div className="App">
      <section className="App-content">
        <Router>
          <Switch>
            <Route path="/seventails">
              {() => _getCoin({ sevenTails: true })}
            </Route>
            <Route path="/trump">{() => _getCoin({ showTrump: true })}</Route>
            <Route path="/trump/seventails">
              {() => _getCoin({ showTrump: true, sevenTails: true })}
            </Route>
            <Route path="/">{() => _getCoin()}</Route>
          </Switch>
        </Router>
      </section>
    </div>
  );
}

export default App;
