import React from 'react';
import PropTypes from 'prop-types';

const SuccessAlert = ({message, hide}) => {
  if (!message) return null;
  return (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      {message}
      <button type="button" className="close" onClick={hide}>
        <span>&times;</span>
      </button>
    </div>
  );
}

SuccessAlert.propTypes = {
  message: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired
};

export default SuccessAlert;