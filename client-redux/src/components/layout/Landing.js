import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';


class Landing extends Component {  

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push('/logged-in');
    }
  }

  render() {
    return (
      <div className="landing">
          <div className="dark-overlay landing-inner text-light">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1 className="display-3 mb-4">Rail Defect Investigation Data Base
                  </h1>
                  <p className="lead">Manage your rail defect investigation data</p>
                  <hr />
                  <Link to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
                  <Link to="/login" className="btn btn-lg btn-light">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.login.isAuthenticated
});

export default connect(mapStateToProps)(Landing);