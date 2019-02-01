import {
  WELDINGS_FILTERSORT_APPLIED,
  WELDINGS_FILTERSORT_APPLY_ERROR,
  LOGOUT
} from "../../actions/types";

const initialState = {
  filterText: "",
  sortText: "",
  error: null
};

export default function weldingsFSReducer(state = initialState, action) {
  switch (action.type) {
    case WELDINGS_FILTERSORT_APPLIED:
      return {
        ...state,
        filterText: action.payload.filterText,
        sortText: action.payload.sortText,
        error: null
      };

    case WELDINGS_FILTERSORT_APPLY_ERROR:
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
