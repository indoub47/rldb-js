import { FILTERSORT_APPLIED,
  LOGOUT } from "../../actions/types";

const initialState = [];

export default function fsedDefectsReducer(state = initialState, action) {
  switch (action.type) {
    
    case FILTERSORT_APPLIED:
      return action.payload.items;

    case LOGOUT:
      return {...initialState};

    default:
      return state;
  }
}
