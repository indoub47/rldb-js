import React from "react";
import PropTypes from "prop-types";

const ErrorAlert = ({ message, hide }) => {
  if (!message) return null;
  const classname =
    hide == null
      ? "alert alert-danger"
      : "alert alert-danger alert-dismissible fade show";
  //const createMarkup = txt => ({__html: txt});
  // return (
  //   <div className={classname} role="alert" dangerouslySetInnerHTML={createMarkup(message)} />
  // );
  return (
    <div className={classname} role="alert">
      {message}
      {hide == null ? null : (
        <button type="button" className="close" onClick={hide}>
          <span>&times;</span>
        </button>
      )}
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string,
  hide: PropTypes.func
};

ErrorAlert.defaultProps = {
  message: "Some error has occured",
  hide: null
};

export default ErrorAlert;
