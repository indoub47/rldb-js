import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {logoutUser} from '../../actions/loginActions';


class Navbar extends Component {

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const {isAuthenticated, user} = this.props.login;    

    const authLinks = (
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <span 
            className='navbar-text'
            style={{marginRight: '10px'}}
          >
          {user.name}
          </span>
        </li>
        <li className='nav-item'>
          <button 
            className='btn btn-dark' 
            type='button'
            onClick={this.onLogoutClick.bind(this)}
          >
            Logout
          </button>
        </li>
      </ul>
    );
    
    const guestLinks = (
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to='/register'>Sign Up</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/login'>Login</Link>
        </li>
      </ul>
    );

    return (
      <nav className='navbar navbar-expand-sm navbar-dark bg-dark mb-4'>
          <div className='container'>
            <Link className='navbar-brand' to='/'>RLDB</Link>
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#mobile-nav'>
              <span className='navbar-toggler-icon'></span>
            </button>

            <div className='collapse navbar-collapse' id='mobile-nav'>
              <ul className='navbar-nav mr-auto'>
                <li className='nav-item'>
                  <Link className='nav-link' to='/profiles'>Profiles</Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/defects'>Defektai</Link>
                </li>
              </ul>
              {isAuthenticated ? authLinks : guestLinks}              
            </div>
          </div>
        </nav>
    );
}}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  login: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  login: state.login
});

export default connect(mapStateToProps, {logoutUser})(Navbar);