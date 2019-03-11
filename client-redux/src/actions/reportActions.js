import axios from "axios";
import { REPORT_BEGIN, REPORT_SUCCESS, REPORT_ERROR } from "./types";

const dispatchReportBegin = () => dispatch =>
  dispatch({
    type: REPORT_BEGIN
  });

const dispatchReportSuccess = report => dispatch =>
  dispatch({
    type: REPORT_SUCCESS,
    payload: { report }
  });

const dispatchReportFailure = error => dispatch =>
  dispatch({
    type: REPORT_ERROR,
    payload: { error }
  });

export const fetchReport = (rtype, params) => (dispatch, getState) => {
  // parinkti reporterį
  const reporter = chooseReporterByRType(rtype);
  if (!reporter) {
    dispatchReportFailure({message: "Unknown report type"});
    return;
  }

  // pagal rtype patikrinti, ar yra atsisiusti reikalingi duomenys
  const hasData = reporter.checkLocalData(getState);

  // čia bus pasidedamas report
  let report;

  // jeigu duomenys yra, sužinoti funciją, kuri duomenis pavers reportu
  if (hasData) {
    dispatchReportBegin();
    try {
      report = reporter.localDataToReport(params, getState);
      dispatchReportSuccess(report);
    } catch (e) {
      dispatchReportFailure(e);
    }
  } else {
    // fetch report data async and create report
    dispatchReportBegin();
    axios
      .get(reporter.apiUrl, { rtype, ...params })
      .then(res => {
        report = reporter.fetchedDataToReport(params, res.data);
        dispatchReportSuccess(report);
      })
      .catch(err => dispatchReportFailure(err));
  }
};

chooseReporterByRType(rtype) {
  switch(rtype) {
    case rType.defectsUndone: return defectsUndoneReporter;
    case rType.k33: return k33Reporter;
    case rType.weldingsExamine: return weldingsExamineReporter;
    default: return null;
  }
}






const k33Reporter = {
  apiUrl: "api/report/k33",
  checkLocalData: getState => {

  },
  fetchedDataToReport: fetchedData => {

  },
  createReportFromLocalData: (params, getState) => {

  }
}

const weldingsExamineReporter = {
  apiUrl: "api/report/weldings-examine",
  checkLocalData: getState => {

  },
  fetchedDataToReport: fetchedData => {

  },
  createReportFromLocalData: (params, getState) => {

  }
}