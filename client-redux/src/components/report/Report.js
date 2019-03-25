import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExportItems from '../common/exportItems/ExportItems';
import {eraseReport} from '../../actions/reportActions';
import rTypeComponentMap from './rTypeComponentMap';
import IsLoading from '../common/IsLoading';
import ErrorAlert from '../common/Alerts/ErrorAlert';

class Report extends Component {
  reporter = null;
  constructor (props) {
    super(props);
    console.log("report constructor", props.rtype);
    this.reporter = rTypeComponentMap[props.rtype];
    this.getItems = this.getItems.bind(this);
  }
  componentDidMount() {
    console.log("report didmount", this.props.rtype);
  }
  componentDidUpdate(prevProps) {
    console.log("report didupdate", this.props.rtype);
    if (this.props.rtype !== prevProps.rtype) {
      this.reporter = rTypeComponentMap[this.props.rtype];
      //this.props.eraseReport();
    }
  }
  
  componentWillUnmount() {
    console.log("report willunmount", this.props.rtype);
    // sunaikinamas
    this.props.eraseReport();
  }

  getItems() {
    return this.props.report;
  }

  render() {
    if (this.props.isLoading) return <IsLoading />;

    console.log("this.reporter", this.reporter);

    const ParamsCollector = this.reporter.paramsCollector;
    const ReportTable = this.reporter.reportTable;

    //console.log("Report render this.props.report", this.props.report);

    return (
      <div className="container">
        <div className="report-title">
          <h3>{this.reporter.title} <small className="text-muted">{this.reporter.subtitle}</small></h3>
        </div>
        <div className="row"><ParamsCollector rtype={this.props.rtype} /></div>
        {this.props.error ? 
          <ErrorAlert error={this.props.error} /> : null}
        {Object.keys(this.props.report).length !== 0 ? 
          (
            <div>
              <div className="row"><ReportTable report={this.props.report} /></div>
              <div className="row"><ExportItems getItems={this.getItems} /></div>
            </div>
          ) : null
        }
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  report: state.report.data,
  error: state.report.error,
  isLoading: state.report.isLoading
});

export default connect (
  mapStateToProps,
  {eraseReport}
)(Report);