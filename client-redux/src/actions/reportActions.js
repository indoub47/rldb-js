import axios from "axios";
import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR,
  ERASE_REPORT
} from "./types";
import Reporter from "./reporters/Reporter";

const reportBegin = () => ({
  type: REPORT_BEGIN
});

const reportSuccess = report => ({
  type: REPORT_SUCCESS,
  payload: { report }
});

const reportFailure = error => ({
  type: REPORT_ERROR,
  payload: { error }
});

export const eraseReport = () => dispatch => {
  dispatch({
    type: ERASE_REPORT
  });
};

export const createReport = (rtype, params) => (dispatch, getState) => {
  // parinkti reporterį
  const reporter = new Reporter(rtype, getState);
  console.log("reporter", reporter);
  if (!reporter) {
    dispatch(reportFailure({ message: "Unknown report type" }));
    return;
  }
  console.log("starting to check local data for a report");
  // čia bus pasidedamas report
  let report;

  // jeigu duomenys yra, sužinoti funciją, kuri duomenis pavers reportu
  if (reporter.localDataExists()) {
    console.log("local data exists");
    //dispatchReportBegin();
    try {
      const localData = reporter.getLocalData();
      console.log("local data", localData);
      report = reporter.createReport(localData, params);
      console.log("report from local data", report);
      //dispatchReportSuccess(report);
      //console.log("dispatchReportSuccess", dispatchReportSuccess);
      dispatch(reportSuccess(report));
      //
      console.log("after dispatchReportSuccess");
    } catch (e) {
      console.log("local data error", e);
      dispatch(reportFailure(e));
    }
  } else {
    console.log("local data doesn't exist");
    // fetch report data async and create report
    dispatch(reportBegin());
    axios
      .get(reporter.getUrl(), { rtype, ...params })
      .then(res => {
        console.log("fetched data", res);
        report = reporter.createReport(res.data, params);
        console.log("report from fetched data", report);
        //dispatchReportSuccess(report);
        //console.log("dispatchReportSuccess", dispatchReportSuccess);
        dispatch(reportSuccess(report));
        //
        console.log("after dispatchReportSuccess");
      })
      .catch(err => {
        console.log("error", err);
        dispatch(reportFailure(err));
      });
  }
};
