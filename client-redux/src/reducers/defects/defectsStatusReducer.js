import {
  DEFECT_DELETE_BEGIN,
  DEFECT_DELETE_FAILURE,
  DEFECT_DELETE_SUCCESS,
  DEFECT_INSERT_BEGIN,
  DEFECT_INSERT_FAILURE,
  DEFECT_INSERT_SUCCESS,
  DEFECT_UPDATE_BEGIN,
  DEFECT_UPDATE_FAILURE,
  DEFECT_UPDATE_SUCCESS,
  FETCH_DEFECTS_BEGIN,
  FETCH_DEFECTS_FAILURE,
  FETCH_DEFECTS_SUCCESS,
  LOGOUT
} from '../../actions/types';

const initialState = {
  error: null,
  version: 0,
  versionError: null,
  isBusy: false,
};

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
      return {
        ...state,
        error: null,
        versionError: action.payload.versionError,
        version: action.payload.version,
        isBusy: false
      };

    case FETCH_DEFECTS_FAILURE:
    case DEFECT_DELETE_FAILURE:
    case DEFECT_UPDATE_FAILURE:
    case DEFECT_INSERT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isBusy: false
      };

    case LOGOUT:
      return initialState;

    default: 
      return state;
  }
}