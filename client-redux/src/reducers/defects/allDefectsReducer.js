import {
  FETCH_DEFECTS_SUCCESS,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_DELETE_SUCCESS,
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
      if (!action.payload) return state;
      return [...state, action.payload];

    // edit defect
    case DEFECT_UPDATE_SUCCESS:
      if (!action.payload) return state;
      const updatedDefect = action.payload;
      let ind = state.findIndex(x => x._id === updatedDefect._id);
      return [
        ...state.slice(0, ind),
        updatedDefect,
        ...state.slice(ind + 1)
      ];

    // delete defect success
    case DEFECT_DELETE_SUCCESS:
      //console.log("action.payload", action.payload);
      if (!action.payload) return state;
      ind = state.findIndex(x => x._id === action.payload);
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
