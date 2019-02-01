import React, { Component } from "react";
//import {Link} from 'react-router-dom';
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import MainDataForm from "./components_of_edit/MainDataForm";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import IsLoading from "../common/IsLoading";
import { updateDefect, insertDefect } from "../../actions/defectsActions";
import getId from "../../utils/getId";

class EditDefect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defect: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitDefect = this.onSubmitDefect.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params._id) {
      const _id = this.props.match.params._id;
      const defect = this.props.defects.find(
        d => d._id === _id
      );
      console.log("defect", defect);
      if (defect) {
        this.setState({ defect });
      }
    }
  }

  onChange(e) {
    const defect = {
      ...this.state.defect,
      [e.target.name]: e.target.value
    };
    this.setState({ defect });
  }

  onSubmitDefect(e) {
    e.preventDefault();
    const defect = this.state.defect;
    if (defect == null) return;
    // validate defect here
    if (defect.id) {
      this.props.updateDefect(defect, this.props.history);
    } else {
      defect.id = getId();
      this.props.insertDefect(defect);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.error && <ErrorAlert message={this.props.error.message} />}
        <IsLoading when={this.props.isBusy} />
        <MainDataForm
          defect={this.state.defect}
          onChange={this.onChange}
          things={this.props.things}
        />
        <button className="btn btn-info" onClick={this.onSubmitDefect}>
          Submit Defect
        </button>
      </React.Fragment>
    );
  }
}

EditDefect.propTypes = {
  updateDefect: PropTypes.func.isRequired,
  insertDefect: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
  error: PropTypes.object
};

const mapStateToProps = state => ({
  isBusy: state.defectsStatus.isBusy,
  error: state.defectsStatus.error,
  things: state.things.data,
  defects: state.fsedDefects.data
});

export default connect(
  mapStateToProps,
  { updateDefect, insertDefect }
)(EditDefect);
