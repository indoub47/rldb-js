import axios from "axios";
import {
  QUERIES_FETCH_BEGIN,
  QUERIES_FETCH_SUCCESS,
  QUERIES_FETCH_FAILURE,
  QUERIES_UPDATE_BEGIN,
  QUERIES_UPDATE_SUCCESS,
  QUERIES_UPDATE_FAILURE
} from "./types";

export const fetchQueriesBegin = (itype) => ({
  type: QUERIES_FETCH_BEGIN,
  payload: {itype}
});

export const fetchQueriesSuccess = (queries, itype) => ({
  type: QUERIES_FETCH_SUCCESS,
  payload: { queries, itype }
});

export const fetchQueriesFailure = (error, itype) => ({
  type: QUERIES_FETCH_FAILURE,
  payload: { error, itype }
});

// Get fsqueries for defects
export const fetchQueries = (itype) => dispatch => {
  dispatch(fetchQueriesBegin(itype));
  axios
    .get(`/api/things/fs/${itype}`)
    .then(res => dispatch(fetchQueriesSuccess(res.data, itype)))
    .catch(err => dispatch(fetchQueriesFailure(err, itype)));
};

export const updateQueriesBegin = (itype) => ({
  type: QUERIES_UPDATE_BEGIN,
  payload: {itype}
});

export const updateQueriesSuccess = (queries, itype) => ({
  type: QUERIES_UPDATE_SUCCESS,
  payload: {queries, itype}
});

export const updateQueriesFailure = (err, itype) => ({
  type: QUERIES_UPDATE_FAILURE,
  payload: { err, itype }
});

// update fsqueries
export const updateQueries = (queries, itype) => dispatch => {
  dispatch(updateQueriesBegin(itype));
  axios
    .post(`/api/things/fs/${itype}/update`, { queries })
    .then(res => dispatch(updateQueriesSuccess(res.data, itype)))
    .catch(err => dispatch(updateQueriesFailure(err, itype)));
};
