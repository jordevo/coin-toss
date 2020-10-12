export const ACTIONS = {
  SET_ANIMATION_FAST: "SET_ANIMATION_FAST",
  ANIMATION_STARTS: "ANIMATION_STARTS",
  ANIMATION_STOPS: "ANIMATION_STOPS",
  COIN_STATE_UPDATE: "COIN_STATE_UPDATE",
  COIN_STATE_RESET: "COIN_STATE_RESET",
  HEADS_COUNT_INCREMENT: "HEADS_COUNT_INCREMENT",
  HEADS_COUNT_RESET: "HEADS_COUNT_RESET",
  KEEP_TOSSING: "KEEP_TOSSING",
  STOP_TOSSING: "STOP_TOSSING",
  STOP_AFTER_N_TAILS: "STOP_AFTER_N_TAILS",
  SUCCESS_MESSAGE_UPDATE: "SUCCESS_MESSAGE_UPDATE",
  SUCCESS_MESSAGE_RESET: "SUCCESS_MESSAGE_RESET",
  TAILS_COUNT_INCREMENT: "TAILS_COUNT_INCREMENT",
  TAILS_COUNT_RESET: "TAILS_COUNT_RESET",
  RESULTS_UPDATE: "RESULTS_UPDATE",
  RESULTS_RESET: "RESULTS_RESET",
};

export const COIN_STATE = { HEADS: "heads", TAILS: "tails" };

export const INITIAL_STATE = {
  coinState: COIN_STATE.HEADS,
  headsCount: 0,
  isAnimating: false,
  isAnimatingFast: false,
  keepTossing: false,
  tailsCount: 0,
  numberOfTailsToStop: 0,
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
    case ACTIONS.HEADS_COUNT_INCREMENT:
      return { ...state, headsCount: state.headsCount + 1 };
    case ACTIONS.HEADS_COUNT_RESET:
      return { ...state, headsCount: INITIAL_STATE.headsCount };
    case ACTIONS.KEEP_TOSSING:
      return { ...state, keepTossing: true };
    case ACTIONS.TAILS_COUNT_INCREMENT:
      return { ...state, tailsCount: state.tailsCount + 1 };
    case ACTIONS.TAILS_COUNT_RESET:
      return { ...state, tailsCount: INITIAL_STATE.tailsCount };
    case ACTIONS.RESULTS_RESET:
      return { ...state, results: INITIAL_STATE.results };
    case ACTIONS.RESULTS_UPDATE:
      return { ...state, results: action.payload };
    case ACTIONS.SET_ANIMATION_FAST:
      return { ...state, isAnimatingFast: true };
    case ACTIONS.STOP_TOSSING:
      return { ...state, keepTossing: false };
    case ACTIONS.STOP_AFTER_N_TAILS:
      return { ...state, numberOfTailsToStop: action.payload };
    case ACTIONS.SUCCESS_MESSAGE_UPDATE:
      return { ...state, successMessage: action.payload };
    case ACTIONS.SUCCESS_MESSAGE_RESET:
      return { ...state, successMessage: INITIAL_STATE.successMessage };
    default:
      throw new Error();
  }
};
