import {
  FETCH_DEFECTS_FAILURE,
  DEFECT_INSERT_FAILURE,
  DEFECT_UPDATE_FAILURE,
  DEFECT_DELETE_FAILURE,
  FETCH_DEFECTS_SUCCESS,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_DELETE_SUCCESS,
  DEFECT_DELETE_NOT_FOUND,
  FETCH_DEFECTS_BEGIN,
  DEFECT_INSERT_BEGIN,
  DEFECT_UPDATE_BEGIN,
  DEFECT_DELETE_BEGIN,
  LOGOUT
} from '../../actions/types';

const initialState = {
  error: null
}

export default function defectsErrorReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DEFECTS_FAILURE:
    case DEFECT_DELETE_FAILURE:
    case DEFECT_UPDATE_FAILURE:
    case DEFECT_INSERT_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };

    case DEFECT_DELETE_NOT_FOUND:
      return {
        ...state,
        error: {msg: "Nothing to delete - defect not found"}
      };
    
    case FETCH_DEFECTS_BEGIN:
    case DEFECT_INSERT_BEGIN:
    case DEFECT_UPDATE_BEGIN:
    case DEFECT_DELETE_BEGIN:
    case FETCH_DEFECTS_SUCCESS: 
    case DEFECT_INSERT_SUCCESS:
    case DEFECT_UPDATE_SUCCESS:
    case DEFECT_DELETE_SUCCESS: 
      return {
        ...state,
        error: null
      };

    case LOGOUT:
      return {...initialState};

    default: 
      return state;
  }
}