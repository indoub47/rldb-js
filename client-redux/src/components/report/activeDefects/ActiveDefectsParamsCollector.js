import React, { Component } from "react";
import { createReport } from "../../../actions/reportActions";
import { connect } from "react-redux";
import TextFieldGroup from "../../common/TextFieldGroup";
import absent from '../../../utils/absent-props';

export class ActiveDefectsParamsCollector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      byDate: null,
      whichDefects: "active", // 'overdued', 'both'
      meistrijos: []
    };
    this.submitParams = this.submitParams.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (e.target.name === "meistrijos") {
      let values = [];
      const options = e.target.options;
      for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      this.setState({meistrijos: values});
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
    console.log("state", this.state);
  }

  submitParams() {
    this.props.createReport(this.props.rtype, this.state);
  }

  render() {
    return (
      <form className="form-inline">
        <TextFieldGroup
          type="date"
          id="bydate"
          label="Datai"
          name="byDate"
          value={absent(this.state.byDate)}
          onChange={this.onChange}
          className="form-group ml5"
        />
        <div className="form-group ml5 whichDefects">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="whichDefects"
              type="radio"
              id="radio-both"
              value="both"
              onChange={this.onChange}
              disabled={true}
            />
            <label className="form-check-label" htmlFor="radio-both">
              Kelyje/pradelsti
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="whichDefects"
              type="radio"
              id="radio-active"
              value="active"
              onChange={this.onChange}
            />
            <label
              className="form-check-label"
              htmlFor="radio-active"
            >
              Kelyje
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              name="whichDefects"
              type="radio"
              id="radio-overdued"
              value="overdued"
              onChange={this.onChange}
            />
            <label className="form-check-label" htmlFor="radio-overdued">
              Pradelsti
            </label>
          </div>
        </div>
        <div className="form-group ml5">
          <label htmlFor="selectMeistrijos">Meistrijos</label>
          <select
            multiple={true}
            defaultValue={this.props.meistrijos.map(m => m.id)}
            onChange={this.onChange}
            className="form-control"
            name="meistrijos"
            id="selectMeistrijos"
            size={
              this.props.meistrijos.length < 5
                ? this.props.meistrijos.length
                : "5"
            }
          >
            {this.props.meistrijos.sort((a, b) => a.ind - b.ind).map(m => (
              <option value={m.id} key={m.id}>
                {m.abbr}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group ml5">
          <button type="button" className="btn" onClick={this.submitParams}>
            Submit
          </button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  meistrijos: state.things.data.meistrija
});

export default connect(
  mapStateToProps,
  { createReport }
)(ActiveDefectsParamsCollector);
