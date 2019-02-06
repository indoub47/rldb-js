import {
  FETCH_ITEMS_SUCCESS,
  ITEM_INSERT_SUCCESS,
  ITEM_UPDATE_SUCCESS,
  ITEM_DELETE_SUCCESS,
  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = [];

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {

    // fetch items
    case FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: action.payload.items
      };

    // create item
    case ITEM_INSERT_SUCCESS:
      if (!action.payload) return state;
      return {
        ...state,
        [action.payload.itype]: [
          ...state[action.payload.itype], 
          action.payload.item
        ]
      };

    // edit item
    case ITEM_UPDATE_SUCCESS:
      if (!action.payload) return state;
      const updatedItem = action.payload.item;
      let ind = state[action.payload.itype].findIndex(x => x._id === updatedItem._id);
      return {
        ...state,
        [action.payload.itype]: [
          ...state[action.payload.itype].slice(0, ind),
          updatedItem,
          ...state[action.payload.itype].slice(ind + 1)
        ]
      };

    // delete item success
    case ITEM_DELETE_SUCCESS:
      if (action.payload.id == null) return state;
      ind = state[action.payload.itype].findIndex(x => x._id === action.payload.id);
      if (ind < 0) return state; // jeigu kartais nerastų tokio id...
      return {
        ...state,
        [action.payload.itype]: [
          ...state[action.payload.itype].slice(0, ind),
          ...state[action.payload.itype].slice(ind + 1)
        ]
      };


    case LOGOUT:
      return initialState;
    
    default:
      return state;
  }
}
