import {
  QUERIES_FETCH_BEGIN,
  QUERIES_FETCH_SUCCESS,
  QUERIES_FETCH_FAILURE,
  QUERIES_UPDATE_BEGIN,
  QUERIES_UPDATE_SUCCESS,
  QUERIES_UPDATE_FAILURE,
  LOGOUT
} from "../actions/types";

const initialState = {
  data: {defect:[], weld: []},
  isLoading: false,
  error: null
};

export default function queriesReducer(state = initialState, action) {
  switch (action.type) {
    case QUERIES_FETCH_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case QUERIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: {
          ...state.data,
          [action.payload.thingType]: action.payload.queries
        }
      };

    case QUERIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };

    case QUERIES_UPDATE_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case QUERIES_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: {
          ...state.data,
          [action.payload.thingType]: action.payload.queries
        }
      };

    case QUERIES_UPDATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };

    case LOGOUT:
      return {...initialState};

    default:
      return state;
  }
}
