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
  defect: {
    data: [],
    valid: false,
    isLoading: false,
    error: null
  },
  welding: {
    data: [],
    valid: false,
    isLoading: false,
    error: null
  }
};

export default function queriesReducer(state = initialState, action) {
  //const tt = action.payload.thingType;
  switch (action.type) {
    case QUERIES_FETCH_BEGIN:
    case QUERIES_UPDATE_BEGIN:
      return {
        ...state,
        [action.payload.thingType]: {
          ...state[action.payload.thingType],
          isLoading: true
        }
      };

    case QUERIES_FETCH_SUCCESS:
    case QUERIES_UPDATE_SUCCESS:
      console.log("queries fetch/update success - payload", action.payload);
      return {
        ...state,
        [action.payload.thingType]: {
          ...state[action.payload.thingType],
          data: action.payload.queries,
          isLoading: false,
          error: null,
          valid: true
        }
      };

    case QUERIES_FETCH_FAILURE:
    case QUERIES_UPDATE_FAILURE:
      return {
        ...state,
        [action.payload.thingType]: {
          ...state[action.payload.thingType],
          isLoading: false,
          error: action.payload.error
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
