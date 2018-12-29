import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = ({errorObj}) => {
  if (!errorObj) return null;
  let messageText = "some error has occured";
  const msgProp = ['message', 'msg', 'info', 'error', 'text'].find(k => errorObj.hasOwnProperty(k));
  if (msgProp) {
    messageText = errorObj[msgProp];
  }
  return (
    <div className="alert alert-danger" role="alert">
      {messageText}
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