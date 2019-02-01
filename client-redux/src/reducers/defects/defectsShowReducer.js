import {
  DEFECT_TOGGLE_FS,
  DEFECT_TOGGLE_FS_MANUAL,
  LOGOUT
} from "../../actions/types";

const initialState = {
  fsOn: false,
  fsManualOn: false
};

export default function defectsShowReducer(state = initialState, action) {
  switch (action.type) {
    case DEFECT_TOGGLE_FS:
      return {
        ...state,
        fsOn: !state.fsOn
      };

    case DEFECT_TOGGLE_FS_MANUAL:
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
