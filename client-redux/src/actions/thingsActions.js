import axios from "axios";
import {
  THINGS_FETCH_BEGIN,
  THINGS_FETCH_SUCCESS,
  THINGS_FETCH_FAILURE,
  THINGS_UPDATE_BEGIN,
  THINGS_UPDATE_SUCCESS,
  THINGS_UPDATE_FAILURE
} from "./types";

export const fetchThingsBegin = () => ({
  type: THINGS_FETCH_BEGIN
});

export const fetchThingsSuccess = things => ({
  type: THINGS_FETCH_SUCCESS,
  payload: { things }
});

export const fetchThingsFailure = error => ({
  type: THINGS_FETCH_FAILURE,
  payload: { error }
});

// Get things for registering user
export const fetchRegisterThings = () => dispatch => {
  dispatch(fetchThingsBegin());
  axios
    .get("/api/things/register")
    .then(res => dispatch(fetchThingsSuccess(res.data)))
    .catch(err => dispatch(fetchThingsFailure(err)));
};

// Get all things for defects
export const fetchDefectThings = () => dispatch => {
  dispatch(fetchThingsBegin());
  axios
    .get("/api/things/defects")
    .then(res => dispatch(fetchThingsSuccess(res.data)))
    .catch(err => dispatch(fetchThingsFailure(err)));
};

// Get all things for all apps
export const fetchAllThings = () => dispatch => {
  dispatch(fetchThingsBegin());
  axios
    .get("/api/things/all")
    .then(res => dispatch(fetchThingsSuccess(res.data)))
    .catch(err => dispatch(fetchThingsFailure(err)));
};

export const updateThingsBegin = () => ({
  type: THINGS_UPDATE_BEGIN
});

export const updateThingsSuccess = res => ({
  type: THINGS_UPDATE_SUCCESS,
  payload: res.data
});

export const updateThingsFailure = err => ({
  type: THINGS_UPDATE_FAILURE,
  payload: { err }
});

export const updateThings = (things, thingType) => dispatch => {
  dispatch(updateThingsBegin());
  axios
    .post("/api/things/update", { things, thingType })
    .then(res => dispatch(updateThingsSuccess(res.data)))
    .catch(err => dispatch(updateThingsFailure(err)));
};
