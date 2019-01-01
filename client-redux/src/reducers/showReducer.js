import {
  TOGGLE_FS,
  TOGGLE_FS_MANUAL,
  LOGOUT
} from "../actions/types";

const initialState = {
  fsOn: {
    defect: true,
    weld: true,
  },

  fsManualOn: {
    defect: true,
    weld: true,
  },
};

export default function showReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FS:
      return {
        ...state,
        fsOn: {
          ...state.fsOn,
          [action.payload.thingType]: !state.fsOn[action.payload.thingType]
        }
      };

    case TOGGLE_FS_MANUAL:
      return {
        ...state,
        fsManualOn: {
          ...state.fsManualOn,
          [action.payload.thingType]: !state.fsManualOn[action.payload.thingType]
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
