import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR
  LOGOUT
} from "../../actions/types";

const initialState = {report: {}, error: null, isLoading: false};

export default function(state = initialState, action) {
  switch (action.type) {

    // begin report
    case REPORT_BEGIN:
      return {
        ...state,
        report: {},
        error: null,
        isLoading: true
      };

    // report success
    case REPORT_SUCCESS:
      return {
        ...state,
        report: action.payload.report,
        error: null,
        isLoading: false
      };

    // report error
    case REPORT_ERROR:
      return {
        ...state,
        report: null,
        error: action.payload.error,
        isLoading: false
      };

    case LOGOUT:
      return initialState;
    
    default:
      return state;
  }
}
