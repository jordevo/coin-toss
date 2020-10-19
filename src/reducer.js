export const ACTIONS = {
  SET_ANIMATION_FAST: "SET_ANIMATION_FAST",
  RESET_ANIMATION_FAST: "RESET_ANIMATION_FAST",
  ANIMATION_STARTS: "ANIMATION_STARTS",
  ANIMATION_STOPS: "ANIMATION_STOPS",
  COIN_STATE_UPDATE: "COIN_STATE_UPDATE",
  COIN_STATE_RESET: "COIN_STATE_RESET",
  HEADS_COUNT_INCREMENT: "HEADS_COUNT_INCREMENT",
  HEADS_COUNT_RESET: "HEADS_COUNT_RESET",
  CONSOLE_MESSAGE_UPDATE: "CONSOLE_MESSAGE_UPDATE",
  CONSOLE_MESSAGE_RESET: "CONSOLE_MESSAGE_RESET",
  SUCCESS_MESSAGE_UPDATE: "SUCCESS_MESSAGE_UPDATE",
  SUCCESS_MESSAGE_RESET: "SUCCESS_MESSAGE_RESET",
  TAILS_COUNT_INCREMENT: "TAILS_COUNT_INCREMENT",
  TAILS_COUNT_RESET: "TAILS_COUNT_RESET",
  TOSS_COIN: "TOSS_COIN",
  TOSS_COIN_RESET: "TOSS_COIN_RESET",
  TOSS_COIN_UNTIL_TAILS: "TOSS_COIN_UNTIL_TAILS",
  TOSS_COIN_UNTIL_TAILS_RESET: "TOSS_COIN_UNTIL_TAILS_RESET",
  RESULTS_UPDATE: "RESULTS_UPDATE",
  RESULTS_RESET: "RESULTS_RESET",
};

export const COIN_STATE = { HEADS: "heads", TAILS: "tails" };

export const INITIAL_STATE = {
  tossCoin: false,
  tossCoinUntilTails: false,
  coinState: COIN_STATE.HEADS,
  consoleMessage: "",
  headsCount: 0,
  isAnimating: false,
  isAnimatingFast: false,
  tailsCount: 0,
  numberOfTailsToStop: 7,
  results: [],
  successMessage: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ANIMATION_STARTS:
      return { ...state, isAnimating: true };
    case ACTIONS.ANIMATION_STOPS:
      return { ...state, isAnimating: false };
    case ACTIONS.COIN_STATE_UPDATE:
      return { ...state, coinState: action.payload };
    case ACTIONS.COIN_STATE_RESET:
      return { ...state, coinState: INITIAL_STATE.coinState };
    case ACTIONS.CONSOLE_MESSAGE_UPDATE:
      return {
        ...state,
        consoleMessage: `${state.consoleMessage} ${action.payload}`,
      };
    case ACTIONS.CONSOLE_MESSAGE_RESET:
      return { ...state, consoleMessage: INITIAL_STATE.consoleMessage };
    case ACTIONS.HEADS_COUNT_INCREMENT:
      return { ...state, headsCount: state.headsCount + 1 };
    case ACTIONS.HEADS_COUNT_RESET:
      return { ...state, headsCount: INITIAL_STATE.headsCount };
    case ACTIONS.TAILS_COUNT_INCREMENT:
      return { ...state, tailsCount: state.tailsCount + 1 };
    case ACTIONS.TAILS_COUNT_RESET:
      return { ...state, tailsCount: INITIAL_STATE.tailsCount };
    case ACTIONS.TOSS_COIN:
      return { ...state, tossCoin: true };
    case ACTIONS.TOSS_COIN_RESET:
      return { ...state, tossCoin: false };
    case ACTIONS.TOSS_COIN_UNTIL_TAILS:
      return { ...state, tossCoinUntilTails: true };
    case ACTIONS.TOSS_COIN_UNTIL_TAILS_RESET:
      return { ...state, tossCoinUntilTails: false };
    case ACTIONS.RESULTS_RESET:
      return { ...state, results: INITIAL_STATE.results };
    case ACTIONS.RESULTS_UPDATE:
      return { ...state, results: action.payload };
    case ACTIONS.SET_ANIMATION_FAST:
      return { ...state, isAnimatingFast: true };
    case ACTIONS.RESET_ANIMATION_FAST:
      return { ...state, isAnimatingFast: false };
    case ACTIONS.SUCCESS_MESSAGE_UPDATE:
      return { ...state, successMessage: action.payload };
    case ACTIONS.SUCCESS_MESSAGE_RESET:
      return { ...state, successMessage: INITIAL_STATE.successMessage };
    default:
      throw new Error();
  }
};
