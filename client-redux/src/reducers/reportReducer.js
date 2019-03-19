import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR,
  ERASE_REPORT,
  LOGOUT
} from "../actions/types";

const initialState = {data: {}, error: null, isLoading: false};

export default function(state = initialState, action) {
  switch (action.type) {

    // begin report
    case REPORT_BEGIN:
      return {
        ...state,
        data: {},
        error: null,
        isLoading: true
      };

    // report success
    case REPORT_SUCCESS:
      console.log("report reducer - report success - report", action.payload.report);
      return {
        ...state,
        data: action.payload.report,
        error: null,
        isLoading: false
      };

    // report error
    case REPORT_ERROR:
      return {
        ...state,
        data: {},
        error: action.payload.error,
        isLoading: false
      };

    case ERASE_REPORT: 
    case LOGOUT:
      return initialState;
    
    default:
      return state;
  }
}
