import React from 'react';
import PropTypes from 'prop-types';

const WarningAlert = ({message, hide}) => {
  if (!message) return null;
  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      {message}
      <button type="button" className="close" onClick={hide}>
        <span>&times;</span>
      </button>
    </div>
  );
}

WarningAlert.propTypes = {
  message: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired
};

export default WarningAlert;