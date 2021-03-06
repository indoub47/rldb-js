import React from "react";
import PropTypes from "prop-types";

const ErrorAlert = ({ message, hide }) => {
  // message - string or array of strings
  if (!message) return null;
  let displayMsg;
  if (typeof message === 'string') {
    displayMsg = message.trim();
    if (!displayMsg) return null;
  } else if (Array.isArray(message)) {
    if (message.length === 0) return null;
    displayMsg = [];
    // create an array in displayMsg:
    // [item0, <br />, item1, <br />, item3]
    message.forEach((item, i) => {
      displayMsg.push(item);
      if (i < message.length-1) {
        displayMsg.push(<br />);
      }
    });
  }

  const classname =
    hide == null
      ? "alert alert-danger"
      : "alert alert-danger alert-dismissible fade show";

  return (
    <div className={classname} role="alert">
      {displayMsg}
      {hide == null ? null : (
        <button type="button" className="close" onClick={hide}>
          <span>&times;</span>
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
