const Validator = require('validator');
const isNonStringOrEmpty = require('../utilities/is-empty').isNonStringOrEmpty;
const isEmpty = require('../utilities/is-empty').isEmpty;

module.exports = function validateLoginInput(data) {
  let errors = {};
  const email = data.email;
  const password = data.password;
  
  if (isNonStringOrEmpty(email)) {
    errors.email = 'email can not be empty';
  }
  
  if (isNonStringOrEmpty(password)) {
    errors.password = 'password can not be empty';
  }
  
  if (isEmpty(errors) &&
	  (!Validator.isLength(password, {min: 6, max: 30}) ||
	  !Validator.isLength(email, {min: 5, max: 200}))) {
	  errors.msg = 'wrong email or password';
  }

  return {errors, isValid: isEmpty(errors)};
}