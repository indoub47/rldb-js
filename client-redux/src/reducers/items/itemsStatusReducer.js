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
  itemListErrorMsg: null,
  singleItemErrorMsg: null,
  fetchError: null,
  warningmsg: null,
  successmsg: null,
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
          warningmsg: null,
          successmsg: null,
          itemListErrorMsg: null,
          singleItemErrorMsg: null,
          fetchError: null,
          isBusy: true
        }
      };

    case ITEM_INSERT_BEGIN:
    case ITEM_UPDATE_BEGIN:
    case ITEM_DELETE_BEGIN:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          warningmsg: null,
          successmsg: null,
          itemListErrorMsg: null,
          singleItemErrorMsg: null,
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
          itemListErrorMsg: null,
          singleItemErrorMsg: null,
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
      // console.log("ITEM_..._FAILURE action.payload", action.payload);
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          itemListErrorMsg:
            action.payload.target === "ITEM_LIST"
              ? action.payload.errormsg
              : null,
          singleItemErrorMsg:
            action.payload.target === "SINGLE_ITEM"
              ? action.payload.errormsg
              : null,
          isBusy: false
        }
      };

    case HIDE_ITEMS_ERROR:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          itemListErrorMsg: null,
          singleItemErrorMsg: null
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
          warningmsg: action.payload.message
        }
      };

    case HIDE_ITEMS_WARNING:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          warningmsg: null
        }
      };

    case ITEMS_SET_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          successmsg: action.payload.message
        }
      };

    case HIDE_ITEMS_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          successmsg: null
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
