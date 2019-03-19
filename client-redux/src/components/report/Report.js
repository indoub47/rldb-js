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
    this.reporter = rTypeComponentMap[props.rtype];
    this.getItems = this.getItems.bind(this);
  }
  
  componentWillUnmount() {
    // sunaikinamas
    this.props.eraseReport();
  }

  getItems() {
    return this.props.report;
  }

  render() {
    if (this.props.isLoading) return <IsLoading />;

    const ParamsCollector = this.reporter.paramsCollector;
    const ReportTable = this.reporter.reportTable;

    return (
      <div className="container">
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