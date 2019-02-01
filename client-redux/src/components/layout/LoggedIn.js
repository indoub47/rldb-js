import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchAllThings } from "../../actions/thingsActions";
import ErrorAlert from "../common/Alerts/ErrorAlert";
import isEmpty from "../../validation/is-empty";
import IsLoading from "../common/IsLoading";

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  componentDidMount() {
    // čia pradėti krauti things
    this.props.fetchAllThings();
  }

  render() {
    const thingsLoadError = this.props.things.error;

    // things load error
    if (!isEmpty(thingsLoadError)) {
      return <ErrorAlert message={thingsLoadError.message} />;
    }

    return (
      <div className="logged-in">
        <IsLoading when={this.props.things.isLoading} />
        <div className="dark-overlay logged-in-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">
                  Rail Defect Investigation Data Base
                </h1>
                <p className="lead">
                  Manage your rail defect investigation data
                </p>
                <hr />
                <p className="lead">
                  You're logged-in, and now you can start working
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoggedIn.propTypes = {
  things: PropTypes.object,
  fetchAllThings: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  things: state.things
});

export default connect(
  mapStateToProps,
  { fetchAllThings }
)(withRouter(LoggedIn));
