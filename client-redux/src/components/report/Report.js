import React, { Component } from "react";
import ReportTable from "./ReportTable";
import IsLoading from "../common/IsLoading";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import ItemsCount from "../common/ItemsCount";
import ExportItems from "../common/exportItems";
import { fetchReport, hideError } from "../../actions/reportActions";
import * as rTypes from "../../reportTypes";
import ParamFields from "./ParamFields";
import ReportTable from "./ReportTable";

class Report extends Report {
  constructor(props) {
    super(props);
    this.submitParams = this.submitParams.bind(this);
  }

  // submitParams(params) {
  //   this.props.fetchReport(this.props.rtype, params);
  // }

  getReport() {
    return this.props.report.rows;
  }

  render() {

    let rest = null;
    if (this.props.error) {
      // if error
      rest = (
        <div className="row">
          <div className="col-12">
            <ErrorAlert message={this.props.error} />
          </div>
        </div>
      );
    } else if (this.props.isLoading) {
      // if empty or loading
      rest = <IsLoading />;
    } else if (this.props.report){
      // if report
      rest = (
        <div className="row">
          <div className="col-12">
            <ReportTable report={this.props.report} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ExportItems items={this.getReport} />
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {<ParamFields rtype={this.props.rtype} />}
          </div>
        </div>
        {rest}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.report.isLoading,
  report: state.report.report,
  error: state.report.error
});

export default connect(mapStateToProps,{fetchReport})(Report);
