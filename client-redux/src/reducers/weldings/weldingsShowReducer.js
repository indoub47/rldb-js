import {
  WELDING_TOGGLE_FS,
  WELDING_TOGGLE_FS_MANUAL,
  LOGOUT
} from "../../actions/types";

const initialState = {
  fsOn: false,
  fsManualOn: false
};

export default function weldingsShowReducer(state = initialState, action) {
  switch (action.type) {
    case WELDING_TOGGLE_FS:
      return {
        ...state,
        fsOn: !state.fsOn
      };

    case WELDING_TOGGLE_FS_MANUAL:
      return {
        ...state,
        fsManualOn: !state.fsManualOn
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
