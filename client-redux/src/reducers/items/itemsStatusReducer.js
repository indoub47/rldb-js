import {
  ITEM_DELETE_BEGIN,
  ITEM_DELETE_FAILURE,
  ITEM_DELETE_SUCCESS,
  ITEM_INSERT_BEGIN,
  ITEM_INSERT_FAILURE,
  ITEM_INSERT_SUCCESS,
  ITEM_UPDATE_BEGIN,
  ITEM_UPDATE_FAILURE,
  ITEM_UPDATE_SUCCESS,
  FETCH_ITEMS_BEGIN,
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_SUCCESS,
  INVALIDATE_ITEMS,
  HIDE_ITEMS_WARNING,
  HIDE_ITEMS_ERROR,
  ITEMS_SET_WARNING,
  HIDE_ITEMS_SUCCESS,
  ITEMS_SET_SUCCESS,
  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = {
  error: null,
  fetchError: null,
  warning: null,
  success: null,
  isBusy: false,
  all: false
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ITEMS_BEGIN:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          warning: null,
          success: null,
          error: null,
          fetchError: null,
          isBusy: true,
        }
      };

    case ITEM_INSERT_BEGIN:
    case ITEM_UPDATE_BEGIN:
    case ITEM_DELETE_BEGIN:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          warning: null,
          success: null,
          error: null,
          isBusy: true
        }
      };

    case FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          fetchError: null,
          isBusy: false
        }
      };

    case ITEM_INSERT_SUCCESS:
    case ITEM_UPDATE_SUCCESS:
    case ITEM_DELETE_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          error: null,
          isBusy: false
        }
      };

    case FETCH_ITEMS_FAILURE:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          fetchError: action.payload.error,
          isBusy: false
        }
      };

    case ITEM_DELETE_FAILURE:
    case ITEM_UPDATE_FAILURE:
    case ITEM_INSERT_FAILURE:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          error: action.payload.error,
          isBusy: false
        }
      };

    case HIDE_ITEMS_ERROR:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          error: null
        }
      };

    case INVALIDATE_ITEMS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          all: action.payload.all
        }
      };

    case ITEMS_SET_WARNING:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          warning: action.payload.message
        }
      };

    case HIDE_ITEMS_WARNING:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          warning: null
        }
      };

    case ITEMS_SET_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          success: action.payload.message
        }
      };

    case HIDE_ITEMS_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          success: null
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
