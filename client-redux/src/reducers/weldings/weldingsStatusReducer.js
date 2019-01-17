import {
  WELDING_DELETE_BEGIN,
  WELDING_DELETE_FAILURE,
  WELDING_DELETE_SUCCESS,
  WELDING_INSERT_BEGIN,
  WELDING_INSERT_FAILURE,
  WELDING_INSERT_SUCCESS,
  WELDING_UPDATE_BEGIN,
  WELDING_UPDATE_FAILURE,
  WELDING_UPDATE_SUCCESS,
  FETCH_WELDINGS_BEGIN,
  FETCH_WELDINGS_FAILURE,
  FETCH_WELDINGS_SUCCESS,
  LOGOUT
} from "../../actions/types";

const initialState = {
  error: null,
  isBusy: false
};

export default function weldingsStatusReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_WELDINGS_BEGIN:
    case WELDING_INSERT_BEGIN:
    case WELDING_UPDATE_BEGIN:
    case WELDING_DELETE_BEGIN:
      return {
        ...state,
        isBusy: true
      };

    case FETCH_WELDINGS_SUCCESS:
    case WELDING_INSERT_SUCCESS:
    case WELDING_UPDATE_SUCCESS:
    case WELDING_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        isBusy: false
      };

    case FETCH_WELDINGS_FAILURE:
    case WELDING_DELETE_FAILURE:
    case WELDING_UPDATE_FAILURE:
    case WELDING_INSERT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isBusy: false
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
