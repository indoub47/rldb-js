const Validator = require("validator");
const isEmpty = require('../utilities/is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, {min: 2, max: 30})) {
    errors.name = 'name must be between 2 and 30 characters';
  }
  
  if (Validator.isEmpty(data.name, {ignore_whitespace: true})) {
	  errors.name = 'name is required';
  }

  if(!Validator.isEmail(data.email)) {
    errors.email = 'email must be a valid email';
  }

  if(!Validator.isLength(data.email, {min: 5, max: 200})) {
    errors.email = 'email can not be longer than 200 characters';
  }
  
  if (Validator.isEmpty(data.email, {ignore_whitespace: true})) {
	  errors.email = 'email is required';
  }

  if (!Validator.isIn(data.role, ['dev', 'adm', 'superadm', 'oper', 'viewer'])) {
    errors.role = 'invalid role; allowed roles are: dev, adm, superadm, oper, viewer';
  }
  
  if (Validator.isEmpty(data.role, {ignore_whitespace: true})) {
	  errors.role = 'role is required';
  }

  if (!Validator.isIn(data.region, ['1', '2', '3', '4'])) {
    errors.region = 'invalid region; allowed regions are: 1, 2, 3, 4';
  }
  
  if (Validator.isEmpty(data.region, {ignore_whitespace: true})) {
	  errors.region = 'region is required';
  }

  if (!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'password must be between 6 and 30 characters';
  }
  
  if (Validator.isEmpty(data.password, {ignore_whitespace: true})) {
	  errors.password = 'password is required';
  }
	
  if (!Validator.equals(data.password, data.password2)) {
	  errors.password2 = 'passwords must match';
  }
  
  if (Validator.isEmpty(data.password2, {ignore_whitespace: true})) {
	  errors.password2 = 'confirm password is required';
  }

  return {errors, isValid: isEmpty(errors)};
}