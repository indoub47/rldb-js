import {
  FILTERSORT_APPLIED,
  FILTERSORT_APPLY_ERROR,
  LOGOUT
} from "../actions/types";

const initialState = {
  filterText: "",
  sortText: "",
  error: null
};

export default function filterSortReducer(state = initialState, action) {
  switch (action.type) {
    case FILTERSORT_APPLIED:
      return {
        ...state,
        filterText: action.payload.filterText,
        sortText: action.payload.sortText,
        error: null
      };

    case FILTERSORT_APPLY_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
