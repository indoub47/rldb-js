import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = ({errorObj}) => {
  if (!errorObj) return null;
  return (
    <div className="alert alert-danger" role="alert">
      {errorObj.message}
    </div>
  );
}

ErrorAlert.propTypes = {
  errorObj: PropTypes.object
};

ErrorAlert.defaultProps = {
  errorObj: null
};

export default ErrorAlert;