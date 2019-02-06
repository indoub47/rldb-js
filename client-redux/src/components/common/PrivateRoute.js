import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect} from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({component: Component, itype, isAuthenticated, ...rest}) => (
  <Route 
    {...rest}
    render = {props =>
      isAuthenticated ? 
        itype ? 
          (<Component {...props} itype={itype} />) 
          : 
          (<Component {...props} />) 
        : 
        (<Redirect to='/login' />)
    }
  />
);

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  itype: PropTypes.string
};

const mapStateToProps = state => ({
  isAuthenticated: state.login.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);