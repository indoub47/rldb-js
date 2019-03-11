import React, { Component } from "react";
import {createReport} from "../../../actions/reportActions";
import connect from "redux";

class ParamFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: null
    };
    this.submitParams = this.submitParams.bind(this);
  }

  getFields(rtype) {
    switch (rtype) {
      case defectsUndone:
      case weldingsExamine:
        return (
          <div>
            <TextFieldGroup
              type="date"
              id="date1"
              label="For Date"
              name="date1"
              value={this.state.date1}
              onChange={onChange}
            />
          </div>
        );

      case k33:
        return (
          <div>
            <TextFieldGroup
              type="date"
              id="datefrom"
              label="From Date"
              name="date1"
              value={this.state.date1}
              onChange={onChange}
            />
            <TextFieldGroup
              type="date"
              id="dateto"
              label="To Date"
              name="date2"
              value={this.state.date2}
              onChange={onChange}
            />
          </div>
        );
    }
  }

  onChange(e) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      params: {
        ...this.state.params,
        [name]: value
      }
    });
  }

  submitParams() {
    this.props.createReport(this.props.rtype, this.state.params);
  }

  render() {
    return (
      <div>
        {getFields(this.props.rtype)}
        <button className="btn btn-sm" onClick={this.submitParams}>
          Create Report
        </button>
      </div>
    );
  }
}

export default connect(
  null,
  {createReport}
)(ParamFields);
