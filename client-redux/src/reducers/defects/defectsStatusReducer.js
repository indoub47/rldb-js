import {
  FETCH_DEFECTS_BEGIN,
  DEFECT_INSERT_BEGIN,
  DEFECT_UPDATE_BEGIN,
  DEFECT_DELETE_BEGIN,
  FETCH_DEFECTS_SUCCESS,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_DELETE_SUCCESS,
  DEFECT_DELETE_NOT_FOUND,
  FETCH_DEFECTS_FAILURE,
  DEFECT_INSERT_FAILURE,
  DEFECT_UPDATE_FAILURE,
  DEFECT_DELETE_FAILURE,
  LOGOUT
} from "../../actions/types";
const initialState = { isBusy: false };

export default function defectsStatusReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DEFECTS_BEGIN:
    case DEFECT_INSERT_BEGIN:
    case DEFECT_UPDATE_BEGIN:
    case DEFECT_DELETE_BEGIN:
      return {
        ...state,
        isBusy: true
      };

    case FETCH_DEFECTS_SUCCESS:
    case DEFECT_INSERT_SUCCESS:
    case DEFECT_UPDATE_SUCCESS:
    case DEFECT_DELETE_SUCCESS:
    case DEFECT_DELETE_NOT_FOUND:
    case FETCH_DEFECTS_FAILURE:
    case DEFECT_INSERT_FAILURE:
    case DEFECT_UPDATE_FAILURE:
    case DEFECT_DELETE_FAILURE:
      return {
        ...state,
        isBusy: false
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
