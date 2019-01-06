import {
  FETCH_DEFECTS_SUCCESS,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_DELETE_SUCCESS,
  DEFECT_DELETE_NOT_FOUND,
  LOGOUT
} from "../../actions/types";

const initialState = [];

export default function allDefectsReducer(state = initialState, action) {
  switch (action.type) {

    // fetch defects
    case FETCH_DEFECTS_SUCCESS:
      return action.payload.defects;

    // create defect
    case DEFECT_INSERT_SUCCESS:
      return [...state, action.payload.result];

    // edit defect
    case DEFECT_UPDATE_SUCCESS:
      const updatedDefect = action.payload.result;
      let ind = state.findIndex(x => x.id === updatedDefect.id);
      return [
        ...state.slice(0, ind),
        updatedDefect,
        ...state.slice(ind + 1)
      ];

    // delete defect success
    case DEFECT_DELETE_SUCCESS:
      //console.log("DEFECT_DELETE_SUCCESS: payload, defect count before removing from local all defects", action.payload, state.length);
      ind = state.findIndex(x => x.id === action.payload.result);
      if (ind < 0) return state; // jeigu kartais nerastų tokio id...
      return [
        ...state.slice(0, ind),
        ...state.slice(ind + 1)
      ];

    case LOGOUT:
      return initialState;
    
    default:
      return state;
  }
}
