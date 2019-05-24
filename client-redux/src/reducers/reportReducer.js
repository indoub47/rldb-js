import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR,
  ERASE_REPORT,
  LOGOUT
} from "../actions/types";

const initialState = {
  data: {},
  rtype: "",
  params: null,
  error: null,
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    // begin report
    case REPORT_BEGIN:
      return {
        ...state,
        data: {},
        params: action.payload.params,
        error: null,
        isLoading: true
      };

    // report success
    case REPORT_SUCCESS:
      return {
        ...state,
        data: action.payload.report,
        rtype: action.payload.rtype,
        error: null,
        isLoading: false
      };

    // report error
    case REPORT_ERROR:
      // console.log("reducer action.payload.error", action.payload.error);
      return {
        ...state,
        data: {},
        rtype: "",
        error: action.payload.error,
        isLoading: false
      };

    case ERASE_REPORT:
    case LOGOUT:
      // console.log("report reducer erasing report");
      return initialState;

    default:
      return state;
  }
}
