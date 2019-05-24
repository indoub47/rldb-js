import axios from "axios";
import setAuthToken from "../utils/set-auth-token";
import jwt_decode from "jwt-decode";
import { LOGIN_BEGIN, SET_CURRENT_USER, LOGIN_ERROR, LOGOUT } from "./types";

// Login user
export const loginBegin = () => ({
  type: LOGIN_BEGIN
});

export const loginError = err => ({
  type: LOGIN_ERROR,
  payload: err.response.data
});

export const logout = () => ({
  type: LOGOUT
});

// export const loginError = err => {
//   // console.log("loginActions err", err);
//   return ({
//   type: LOGIN_ERROR,
//   payload: err.response.data
// })};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const loginUser = userData => dispatch => {
  dispatch(loginBegin());
  axios
    .post("api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // set jwt-token as default header to all axios requests
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch(loginError(err)));
};

// Log user out
export const logoutUser = () => dispatch => {
  // remove token from localStorage
  localStorage.removeItem("jwtToken");
  // remove auth header for future requests;
  setAuthToken(false);
  // set current user to {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch(logout());
};
