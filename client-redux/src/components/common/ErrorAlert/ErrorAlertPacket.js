import React from 'react';
import PropTypes from 'prop-types';
import ErrorAlert from './ErrorAlert';

const ErrorAlertPacket = ({errorObjArray}) => {
  const alerts = errorObjArray.map(eo => <ErrorAlert errorObj={eo} />).filter(ea => ea !== null);
  if (alerts.length < 1) return null;
  return (
    <React.Fragment>
      {alerts}
    </React.Fragment>
  );
}

ErrorAlertPacket.propTypes = {
  errorObjArray: PropTypes.arrayOf(PropTypes.object)
};

ErrorAlertPacket.defaultProps = {
  errorObjArray: []
};

export default ErrorAlertPacket;