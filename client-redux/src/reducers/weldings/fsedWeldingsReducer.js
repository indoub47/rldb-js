import {
  FILTERSORT_APPLIED,
  INVALIDATE_WELDINGS,
  LOGOUT
} from "../../actions/types";

const initialState = { data: [], valid: false };

export default function fsedWeldingsReducer(state = initialState, action) {
  switch (action.type) {
    case FILTERSORT_APPLIED:
      return { data: action.payload.items, valid: true };

    case INVALIDATE_WELDINGS:
      return { ...state, valid: false };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
