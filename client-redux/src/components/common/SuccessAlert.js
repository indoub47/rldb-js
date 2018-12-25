import React from 'react';
import PropTypes from 'prop-types';

const SuccessAlert = ({info}) => {
  if (!error) return null;
  return (
    <div className="alert alert-success" role="alert">
      {info.message}
    </div>
  );
}

SuccessAlert.propTypes = {
  info: PropTypes.object
};

SuccessAlert.defaultProps = {
  info: null
};

export default SuccessAlert;