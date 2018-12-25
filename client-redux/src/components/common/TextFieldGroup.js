import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
  type, 
  id,
  label,
  name, 
  placeholder,
  value,
  error,
  info,
  onChange,
  disabled,
  readonly,
  autoComplete,
  classname,
  divClassname
}) => {
  return (
    <div className={divClassname}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        className={classnames(classname, {
          'is-invalid': error
        })}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readonly}
      />
      {info && 
      <small className='form-text text-muted'>{info}</small>}
      {error &&
      <div className='invalid-feedback'>{error}</div>}
    </div>
  )
}

TextFieldGroup.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  autoComplete: PropTypes.string.isRequired,
  disabled: PropTypes.string,
  classname: PropTypes.string,
  divClassname: PropTypes.string,
}

TextFieldGroup.defaultProps = {
  type: 'text', 
  autoComplete: "on",
  classname: 'form-control',
  divClassname: 'form-group',
  onChange: null
}

export default TextFieldGroup;
