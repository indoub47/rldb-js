import { FILTERSORT_APPLIED,
  LOGOUT } from "../../actions/types";

const initialState = {data: [], valid: false};

export default function fsedDefectsReducer(state = initialState, action) {
  switch (action.type) {
    
    case FILTERSORT_APPLIED:
      return {data: action.payload.items, valid: true};

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
