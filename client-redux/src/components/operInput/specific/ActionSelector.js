import React from 'react';

const ActionSelector = ({action, ind, toggleAction}) => {
  return(
    <select 
      name="action" 
      className={"by-option " + action}
      data-ind={ind}
      value={action}
      onChange={toggleAction}
      id={ind}
    >
      <option key={"0"} value="none" className="none">None</option>
      <option key={"1"} value="ok" className="ok">OK</option>
      <option key={"2"} value="return" className="return">Return</option>
      <option key={"3"} value="delete" className="delete">Delete</option>
    </select>);
}

export default ActionSelector;