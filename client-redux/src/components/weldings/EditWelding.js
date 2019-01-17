import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import MainDataForm from "./components_edit/MainDataForm";
import EditHistory from "./components_edit/EditHistory";
import ErrorAlert from "../common/ErrorAlert/ErrorAlert";
import IsLoading from "../common/IsLoading";
import { updateWelding, insertWelding } from "../../actions/weldingsActions";
import getId from "../../utils/getId";

class EditWelding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      welding: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitWelding = this.onSubmitWelding.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      const welding = this.props.weldings.find(
        d => d.id === this.props.match.params.id
      );
      if (welding) {
        this.setState({ welding });
      }
    }
  }

  onChange(e) {
    const welding = {
      ...this.state.welding,
      [e.target.name]: e.target.value
    };
    this.setState({ welding });
  }

  onSubmitWelding(e) {
    e.preventDefault();
    const welding = this.state.welding;
    if (welding == null) return;
    // validate welding here
    if (welding.id) {
      this.props.updateWelding(welding, this.props.history);
    } else {
      welding.id = getId();
      this.props.insertWelding(welding);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.error && <ErrorAlert errorObj={this.props.error} />}
        <IsLoading when={this.props.isBusy} />
        <MainDataForm
          welding={this.state.welding}
          onChange={this.onChange}
          things={this.props.things}
        />
        
        <button className="btn btn-info" onClick={this.onSubmitWelding}>
          Submit Welding
        </button>
      </React.Fragment>
    );
  }
}

EditWelding.propTypes = {
  updateWelding: PropTypes.func.isRequired,
  insertWelding: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
  error: PropTypes.object
};

const mapStateToProps = state => ({
  isBusy: state.weldingsStatus.isBusy,
  error: state.weldingsStatus.error,
  things: state.things.data,
  weldings: state.fsedWeldings.data
});

export default connect(
  mapStateToProps,
  { updateWelding, insertWelding }
)(EditWelding);
