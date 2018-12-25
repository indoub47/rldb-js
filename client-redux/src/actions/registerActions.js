import axios from "axios";
import { REGISTER_BEGIN, REGISTER_SUCCESS, REGISTER_ERROR } from "./types";

export const registerBegin = () => ({
  type: REGISTER_BEGIN
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS
});

export const registerError = err => ({
  type: REGISTER_ERROR,
  payload: err.response.data
});

// Register
export const registerUser = (userData, history) => dispatch => {
  dispatch(registerBegin());
  axios
    .post("/api/users/register", userData)
    .then(res => {
      dispatch(registerSuccess());
      history.push("/");
    })
    .catch(err => dispatch(registerError(err)));
};
