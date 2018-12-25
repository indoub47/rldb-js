import {
  CREATE_DEFECT,
  EDIT_DEFECT,
  REMOVE_DEFECT,
  CANCEL_CREATE_DEFECT,
  CANCEL_EDIT_DEFECT,
  CANCEL_REMOVE_DEFECT,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_DELETE_SUCCESS,
  DEFECT_SHOW_HISTORY,
  CANCEL_SHOW_HISTORY,
  LOGOUT
} from "../../actions/types";

const initialState = {
  currentDefect: null,
  defectCreate: false,
  defectEdit: false,
  defectRemove: false,
  showHistory: false,
}

export default function defectIntentReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_DEFECT:
      return {
        ...state,
        defectCreate: true
      };

    case EDIT_DEFECT:
      return {
        ...state,
        defectEdit: true,
        currentDefect: action.payload.defect
      };
      
    case REMOVE_DEFECT:
      return {
        ...state,
        defectRemove: true
      };
      
    case DEFECT_SHOW_HISTORY:
      return {
        ...state,
        showHistory: true,
        currentDefect: action.payload.defect
      };

    case DEFECT_INSERT_SUCCESS:
    case CANCEL_CREATE_DEFECT:
      return {
        ...state,
        defectCreate: false
      };

    case DEFECT_UPDATE_SUCCESS:
      return {
        ...state,
        defectEdit: false
      };

    case CANCEL_EDIT_DEFECT:
      return {
        ...state,
        defectEdit: false,
        currentDefect: null
      };
      
    case DEFECT_DELETE_SUCCESS:
    case CANCEL_REMOVE_DEFECT:
      return {
        ...state,
        defectRemove: false
      };

    case CANCEL_SHOW_HISTORY:
      return {
        ...state,
        showHistory: false,
        currentDefect: null
      }

    case LOGOUT:
      return {...initialState};
    
    default:
      return state;
  }
}