import axios from "axios";
import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR,
  ERASE_REPORT
} from "./types";
import Reporter from "./reporters/Reporter";

const reportBegin = params => ({
  type: REPORT_BEGIN,
  payload: {params}
});

const reportSuccess = (report, rtype) => ({
  type: REPORT_SUCCESS,
  payload: { report, rtype }
});

const reportFailure = error => ({
  type: REPORT_ERROR,
  payload: {error}
});

export const eraseReport = () => dispatch => {
  console.log("dispatching erase report");
  dispatch({
    type: ERASE_REPORT
  });
};

export const createReport = (rtype, params) => dispatch => {
  // parinkti reporterį
  const reporter = new Reporter(rtype);
  //console.log("reporter", reporter);
  if (!reporter) {
    dispatch(reportFailure({ message: "Unknown report type" }));
    return;
  }
  
  dispatch(reportBegin(params));
  
  // fetch report data async and create report
  axios
    .get(reporter.getUrl(), {params: {...params}})
    .then(res => {
      const report = reporter.createReport(res.data);
      dispatch(reportSuccess(report, rtype));
    })
    .catch(err => {
      console.log("errr", err);
      dispatch(reportFailure(err));
    });
};
