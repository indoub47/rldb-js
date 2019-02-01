import {
  DEFECTS_FILTERSORT_APPLIED,
  DEFECTS_FILTERSORT_APPLY_ERROR,
  DEFECTS_REFRESH,
  LOGOUT
} from "../../actions/types";

const initialState = {
  filterText: "",
  sortText: "",
  error: null
};

export default function defectsFSReducer(state = initialState, action) {
  switch (action.type) {
    case DEFECTS_FILTERSORT_APPLIED:
      return {
        ...state,
        filterText: action.payload.filterText,
        sortText: action.payload.sortText,
        error: null
      };

    case DEFECTS_FILTERSORT_APPLY_ERROR:
      return {
        ...state,
        error: action.payload.error
      };
    
    case DEFECTS_REFRESH:
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
