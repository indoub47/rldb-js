import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


const SelectInputGroup = ({
  options,
  name,
  id,
  value,
  onChange,
  label,
  size,
  style,
  multiple,
  disabled,
  classname,
  divClassname,
  error,
  info
}) => {
  return (
    <div className={divClassname}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        className={classnames(classname, {'is-invalid': error})}
        name={name}
        id={id}
        multiple={multiple} 
        disabled={disabled} 
        onChange={onChange}
        size={size}
        style={style}
        value={value}
      >
        {options}
      </select>
      {info && <small className='form-text text-muted'>{info}</small>}
      {error && (
        <div className='invalid-feedback'>{error}</div>
      )}
    </div>
  );
}

SelectInputGroup.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string,
  multiple: PropTypes.string,
  disabled: PropTypes.string,
  classname: PropTypes.string,
  divClassname: PropTypes.string,
  style: PropTypes.object
}

SelectInputGroup.defaultProps = {
  classname: 'form-control',
  divClassname: 'form-group'
}

export default SelectInputGroup;