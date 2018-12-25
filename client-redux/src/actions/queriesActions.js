import axios from "axios";
import {
  QUERIES_FETCH_BEGIN,
  QUERIES_FETCH_SUCCESS,
  QUERIES_FETCH_FAILURE,
  QUERIES_UPDATE_BEGIN,
  QUERIES_UPDATE_SUCCESS,
  QUERIES_UPDATE_FAILURE
} from "./types";

export const fetchQueriesBegin = () => ({
  type: QUERIES_FETCH_BEGIN
});

export const fetchQueriesSuccess = (queries, thingType) => ({
  type: QUERIES_FETCH_SUCCESS,
  payload: { queries, thingType }
});

export const fetchQueriesFailure = error => ({
  type: QUERIES_FETCH_FAILURE,
  payload: { error }
});

// Get fsqueries for defects
export const fetchQueries = (thingType) => dispatch => {
  dispatch(fetchQueriesBegin());
  axios
    .get(`/api/things/fs/${thingType}`)
    .then(res => dispatch(fetchQueriesSuccess(res.data, thingType)))
    .catch(err => dispatch(fetchQueriesFailure(err)));
};

export const updateQueriesBegin = () => ({
  type: QUERIES_UPDATE_BEGIN
});

export const updateQueriesSuccess = (queries, thingType) => ({
  type: QUERIES_UPDATE_SUCCESS,
  payload: {queries, thingType}
});

export const updateQueriesFailure = err => ({
  type: QUERIES_UPDATE_FAILURE,
  payload: { err }
});

// update fsqueries
export const updateQueries = (queries, thingType) => dispatch => {
  dispatch(updateQueriesBegin());
  axios
    .post(`/api/things/fs/${thingType}/update`, { queries })
    .then(res => dispatch(updateQueriesSuccess(res.data, thingType)))
    .catch(err => dispatch(updateQueriesFailure(err)));
};
