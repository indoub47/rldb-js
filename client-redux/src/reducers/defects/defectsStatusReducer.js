import {
  DEFECT_DELETE_BEGIN,
  DEFECT_DELETE_FAILURE,
  DEFECT_DELETE_SUCCESS,
  DEFECT_INSERT_BEGIN,
  DEFECT_INSERT_FAILURE,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_BEGIN,
  DEFECT_UPDATE_FAILURE,
  DEFECT_UPDATE_SUCCESS,
  FETCH_DEFECTS_BEGIN,
  FETCH_DEFECTS_FAILURE,
  FETCH_DEFECTS_SUCCESS,
  INVALIDATE_DEFECTS,
  HIDE_DEFECTS_WARNING,
  HIDE_DEFECTS_ERROR,
  DEFECTS_SET_WARNING,
  HIDE_DEFECTS_SUCCESS,
  DEFECTS_SET_SUCCESS,
  LOGOUT
} from "../../actions/types";

const initialState = {
  error: null,
  fetchError: null,
  warning: null,
  success: null,
  isBusy: false,
  all: false
};

export default function defectsStatusReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DEFECTS_BEGIN:
      return {
        ...state,
        warning: null,
        success: null,
        error: null,
        fetchError: null,
        isBusy: true,
      };

    case DEFECT_INSERT_BEGIN:
    case DEFECT_UPDATE_BEGIN:
    case DEFECT_DELETE_BEGIN:
      return {
        ...state,
        warning: null,
        success: null,
        error: null,
        isBusy: true
      };

    case FETCH_DEFECTS_SUCCESS:
      return {
        ...state,
        fetchError: null,
        isBusy: false
      };

    case DEFECT_INSERT_SUCCESS:
    case DEFECT_UPDATE_SUCCESS:
    case DEFECT_DELETE_SUCCESS:
      return {
        ...state,
        error: null,
        isBusy: false
      };

    case FETCH_DEFECTS_FAILURE:
      return {
        ...state,
        fetchError: action.payload.error,
        isBusy: false
      };

    case DEFECT_DELETE_FAILURE:
    case DEFECT_UPDATE_FAILURE:
    case DEFECT_INSERT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isBusy: false
      };

    case HIDE_DEFECTS_ERROR:
      return {
        ...state,
        error: null
      };

    case INVALIDATE_DEFECTS:
      return {
        ...state,
        all: action.payload.all
      };

    case DEFECTS_SET_WARNING:
      return {
        ...state,
        warning: action.payload.message
      };

    case HIDE_DEFECTS_WARNING:
      return {
        ...state,
        warning: null
      };

    case DEFECTS_SET_SUCCESS:
      return {
        ...state,
        success: action.payload.message
      };

    case HIDE_DEFECTS_SUCCESS:
      return {
        ...state,
        success: null
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
