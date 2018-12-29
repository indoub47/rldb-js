import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/registerActions';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectInputGroup from '../common/SelectInputGroup';
import {fetchRegisterThings} from '../../actions/thingsActions';
import isEmpty from '../../validation/is-empty';
import {createOptions} from '../createOptions';
import IsLoading from '../common/IsLoading';


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      role: '',
      region: '',
      password: '',
      password2: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push('/logged-in');
    }
    this.props.fetchRegisterThings();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      region: this.state.region,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const inputErrors = this.props.register.error || {};
    const thingsIsLoading = isEmpty(this.props.things.data) || this.props.things.isLoading;

    // things load error
    if (!isEmpty(this.props.things.error)) {
      return (
        <div>
          <h1>Error!</h1> 
          <p>{this.props.things.error.message}</p>
        </div>
      );
    }

    // things data is not empty
    return (      
      <div className='register'>
        {this.props.register.isBusy ? <IsLoading /> : null}
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <h1 className='display-4 text-center'>Sign Up</h1>
              <p className='lead text-center'>Create your RLDB account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  name='name'
                  placeholder='Name'
                  value={this.state.name}
                  onChange={this.onChange}
                  error={inputErrors.name}
                  autoComplete='off'
                />
                <TextFieldGroup
                  name='email'
                  type='email'
                  placeholder='Email'
                  value={this.state.email}
                  onChange={this.onChange}
                  error={inputErrors.email}
                  autoComplete='off'
                />
                {thingsIsLoading ?
                <input className="form-control form-control-lg" type="text" placeholder="loading data…" readOnly />
                :
                <SelectInputGroup
                  name='role'
                  options={createOptions(this.props.things.data.urole, "Select Role")}
                  value={this.state.role}
                  onChange={this.onChange}
                  error={inputErrors.role}
                />
                }
                {thingsIsLoading ?
                <input className="form-control form-control-lg" type="text" placeholder="loading data…" readOnly />
                :
                <SelectInputGroup
                  name='region'
                  options={createOptions(this.props.things.data.region, "Select Region")}
                  value={this.state.region}
                  onChange={this.onChange}
                  error={inputErrors.region}
                />
                }
                <TextFieldGroup
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.onChange}
                  error={inputErrors.password}
                  autoComplete='off'
                />
                <TextFieldGroup
                  type='password'
                  name='password2'
                  placeholder='Retype Password'
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={inputErrors.password2}
                  autoComplete='off'
                />
                <input type='submit' className='btn btn-info btn-block mt-4' />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  fetchRegisterThings: PropTypes.func.isRequired,
  register: PropTypes.object.isRequired,
  things: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  register: state.register,
  things: state.things,
  isAuthenticated: state.login.isAuthenticated
});

export default connect(
  mapStateToProps,
  { registerUser, fetchRegisterThings }
)(withRouter(Register));
