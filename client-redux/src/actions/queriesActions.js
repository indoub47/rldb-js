import axios from "axios";
import {
  QUERIES_FETCH_BEGIN,
  QUERIES_FETCH_SUCCESS,
  QUERIES_FETCH_FAILURE,
  QUERY_INSERT_BEGIN,
  QUERY_INSERT_SUCCESS,
  QUERY_INSERT_FAILURE,
  QUERY_UPDATE_BEGIN,
  QUERY_UPDATE_SUCCESS,
  QUERY_UPDATE_FAILURE,
  QUERY_DELETE_BEGIN,
  QUERY_DELETE_SUCCESS,
  QUERY_DELETE_FAILURE,
  HIDE_QUERIES_WARNING,
  HIDE_QUERIES_SUCCESS,
  HIDE_QUERIES_ERROR
} from "./types";

export const hideWarning = itype => dispatch =>
  dispatch({
    type: HIDE_QUERIES_WARNING,
    payload: {itype}
  });

export const hideSuccess = itype => dispatch =>
  dispatch({
    type: HIDE_QUERIES_SUCCESS,
    payload: {itype}
  });

export const hideError = itype => dispatch =>
  dispatch({
    type: HIDE_QUERIES_ERROR,
    payload: {itype}
  });

const fetchQueriesBegin = (itype) => ({
  type: QUERIES_FETCH_BEGIN,
  payload: {itype}
});

const fetchQueriesSuccess = (queries, itype) => ({
  type: QUERIES_FETCH_SUCCESS,
  payload: { queries, itype }
});

const fetchQueriesFailure = (err, itype) => ({
  type: QUERIES_FETCH_FAILURE,
  payload: { err, itype }
});

// Get fsqueries
export const fetchQueries = itype => dispatch => {
  dispatch(fetchQueriesBegin(itype));
  axios
    .get(`/api/fsqueries/fetch`, {params: {itype}})
    .then(res => dispatch(fetchQueriesSuccess(res.data, itype)))
    .catch(err => dispatch(fetchQueriesFailure(err, itype)));
};

const updateQueryBegin = (itype) => ({
  type: QUERY_UPDATE_BEGIN,
  payload: {itype}
});

const updateQuerySuccess = (query, itype) => ({
  type: QUERY_UPDATE_SUCCESS,
  payload: {query, itype}
});

const updateQueryFailure = (err, itype) => ({
  type: QUERY_UPDATE_FAILURE,
  payload: { err: err.errmsg, itype }
});

// update fsquery
export const updateQuery = draft => dispatch => {
  const itype = draft.itype;
  dispatch(updateQueryBegin(itype));
  axios
    .post(`/api/fsqueries/update`, draft)
    .then(res => dispatch(updateQuerySuccess(res.data.data, itype)))
    .catch(err => dispatch(updateQueryFailure(err, itype)));
};

const insertQueryBegin = (itype) => ({
  type: QUERY_INSERT_BEGIN,
  payload: {itype}
});

const insertQuerySuccess = (query, itype) => ({
  type: QUERY_INSERT_SUCCESS,
  payload: {query, itype}
});

const insertQueryFailure = (err, itype) => ({
  type: QUERY_INSERT_FAILURE,
  payload: { err, itype }
});

// insert fsquery
export const insertQuery = draft => dispatch => {
  const itype = draft.itype;
  dispatch(insertQueryBegin(itype));
  axios
    .post(`/api/fsqueries/insert`, draft)
    .then(res => dispatch(insertQuerySuccess(res.data.data, itype)))
    .catch(err => dispatch(insertQueryFailure(err, itype)));
};

const deleteQueryBegin = (itype) => ({
  type: QUERY_DELETE_BEGIN,
  payload: {itype}
});

const deleteQuerySuccess = (id, itype) => {
  console.log("success", id, itype);
  return ({
    type: QUERY_DELETE_SUCCESS,
    payload: {id, itype}
  });
};

const deleteQueryFailure = (err, itype) => {
  console.log("failure", err, itype); 
  return ({
    type: QUERY_DELETE_FAILURE,
    payload: { err, itype }
  });
};

// delete fsquery
export const deleteQuery = (id, itype) => dispatch => {
  dispatch(deleteQueryBegin(itype));
  axios
    .delete(`/api/fsqueries/delete`, {params: {id}})
    .then(res => dispatch(deleteQuerySuccess(res.data.data, itype)))
    .catch(err => dispatch(deleteQueryFailure(err, itype)));
};
