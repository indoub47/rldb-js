import {
  IAPPROVE_FETCH_BEGIN,
  IAPPROVE_FETCH_SUCCESS,
  IAPPROVE_FETCH_FAILURE,
  IAPPROVE_PROCESS_BEGIN,
  IAPPROVE_PROCESS_SUCCESS,
  IAPPROVE_PROCESS_FAILURE,
  IAPPROVE_INFO_REMOVE,
  IAPPROVE_SET_ACTION,
  IAPPROVE_SET_NOTE,
  LOGOUT
} from "../actions/types";

const stateObj = {
  items: [],
  isLoading: false,
  info: null
};

const initialState = { ...stateObj };

export default function(state = initialState, action) {
  switch (action.type) {
    case IAPPROVE_FETCH_BEGIN:
    case IAPPROVE_PROCESS_BEGIN:
      return {
        ...state,
        info: null,
        isLoading: true
      };

    case IAPPROVE_FETCH_SUCCESS:
      const items = action.payload.items.map(i => ({ ...i, action: "none" }));
      return {
        ...state,
        items,
        isLoading: false
      };

    case IAPPROVE_PROCESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        info: { message: action.payload.info, type: "info" }
      };

    case IAPPROVE_FETCH_FAILURE:
    case IAPPROVE_PROCESS_FAILURE:
      return {
        ...state,
        info: { message: action.payload.errormsg, type: "error" },
        isLoading: false
      };

    case IAPPROVE_INFO_REMOVE:
      return {
        ...state,
        info: null
      };

    case IAPPROVE_SET_NOTE: {
      const ind = action.payload.index;
      const item = {
        ...state.items[ind]
      };
      item.journal.note = action.payload.value;
      const items = [
        ...state.items.slice(0, ind),
        item,
        ...state.items.slice(ind + 1)
      ];
      return {
        ...state,
        items
      };
    }

    case IAPPROVE_SET_ACTION: {
      const ind = action.payload.index;
      const item = {
        ...state.items[ind],
        action: action.payload.value
      };
      const items = [
        ...state.items.slice(0, ind),
        item,
        ...state.items.slice(ind + 1)
      ];
      return {
        ...state,
        items
      };
    }

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
