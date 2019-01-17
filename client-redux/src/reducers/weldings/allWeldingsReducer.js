import {
  FETCH_WELDINGS_SUCCESS,
  WELDING_INSERT_SUCCESS,
  WELDING_UPDATE_SUCCESS,
  WELDING_DELETE_SUCCESS,
  LOGOUT
} from "../../actions/types";

const initialState = [];

export default function allWeldingsReducer(state = initialState, action) {
  switch (action.type) {
    // fetch weldings
    case FETCH_WELDINGS_SUCCESS:
      return action.payload.weldings;

    // create welding
    case WELDING_INSERT_SUCCESS:
      return [...state, action.payload];

    // edit welding
    case WELDING_UPDATE_SUCCESS:
      const updatedWelding = action.payload;
      let ind = state.findIndex(x => x._id === updatedWelding._id);
      return [...state.slice(0, ind), updatedWelding, ...state.slice(ind + 1)];

    // delete welding success
    case WELDING_DELETE_SUCCESS:
      if (!action.payload) return state;
      ind = state.findIndex(x => x._id === action.payload);
      if (ind < 0) return state; // jeigu kartais nerastų tokio id...
      return [...state.slice(0, ind), ...state.slice(ind + 1)];

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
