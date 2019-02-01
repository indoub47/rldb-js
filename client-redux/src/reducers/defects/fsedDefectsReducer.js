import { 
  DEFECTS_FILTERSORT_APPLIED,
  INVALIDATE_DEFECTS,
  LOGOUT 
  } from "../../actions/types";

const initialState = {data: [], valid: false};

export default function fsedDefectsReducer(state = initialState, action) {
  switch (action.type) {
    
    case DEFECTS_FILTERSORT_APPLIED:
      return {data: action.payload.items, valid: true};
    
    case INVALIDATE_DEFECTS:
      return {...state, valid: false};

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
