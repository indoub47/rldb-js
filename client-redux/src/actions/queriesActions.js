import axios from "axios";
import {
  QUERIES_FETCH_BEGIN,
  QUERIES_FETCH_SUCCESS,
  QUERIES_FETCH_FAILURE,
  QUERIES_UPDATE_BEGIN,
  QUERIES_UPDATE_SUCCESS,
  QUERIES_UPDATE_FAILURE
} from "./types";

export const fetchQueriesBegin = (thingType) => ({
  type: QUERIES_FETCH_BEGIN,
  payload: {thingType}
});

export const fetchQueriesSuccess = (queries, thingType) => ({
  type: QUERIES_FETCH_SUCCESS,
  payload: { queries, thingType }
});

export const fetchQueriesFailure = (error, thingType) => ({
  type: QUERIES_FETCH_FAILURE,
  payload: { error, thingType }
});

// Get fsqueries for defects
export const fetchQueries = (thingType) => dispatch => {
  dispatch(fetchQueriesBegin(thingType));
  axios
    .get(`/api/things/fs/${thingType}`)
    .then(res => dispatch(fetchQueriesSuccess(res.data, thingType)))
    .catch(err => dispatch(fetchQueriesFailure(err, thingType)));
};

export const updateQueriesBegin = (thingType) => ({
  type: QUERIES_UPDATE_BEGIN,
  payload: {thingType}
});

export const updateQueriesSuccess = (queries, thingType) => ({
  type: QUERIES_UPDATE_SUCCESS,
  payload: {queries, thingType}
});

export const updateQueriesFailure = (err, thingType) => ({
  type: QUERIES_UPDATE_FAILURE,
  payload: { err, thingType }
});

// update fsqueries
export const updateQueries = (queries, thingType) => dispatch => {
  dispatch(updateQueriesBegin(thingType));
  axios
    .post(`/api/things/fs/${thingType}/update`, { queries })
    .then(res => dispatch(updateQueriesSuccess(res.data, thingType)))
    .catch(err => dispatch(updateQueriesFailure(err, thingType)));
};
