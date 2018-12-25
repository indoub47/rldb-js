import {
  FETCH_DEFECTS_FAILURE,
  DEFECT_INSERT_FAILURE,
  DEFECT_UPDATE_FAILURE,
  DEFECT_DELETE_FAILURE,
  FETCH_DEFECTS_SUCCESS,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_DELETE_SUCCESS,
  LOGOUT
} from '../../actions/types';

const initialState = {
  error: null
}

export default function defectsErrorReducer(state = initialState, action) {
  switch (action.type) {
    case DEFECT_DELETE_FAILURE:
    case DEFECT_UPDATE_FAILURE:
    case DEFECT_INSERT_FAILURE:
    case FETCH_DEFECTS_FAILURE: 
      return {
        ...state,
        error: action.payload.error
      };
    
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