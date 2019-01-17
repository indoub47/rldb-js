import axios from "axios";
import {
  FETCH_WELDINGS_BEGIN,
  FETCH_WELDINGS_SUCCESS,
  FETCH_WELDINGS_FAILURE,
  WELDING_INSERT_BEGIN,
  WELDING_INSERT_SUCCESS,
  WELDING_INSERT_FAILURE,
  WELDING_UPDATE_BEGIN,
  WELDING_UPDATE_SUCCESS,
  WELDING_UPDATE_FAILURE,
  WELDING_DELETE_BEGIN,
  WELDING_DELETE_SUCCESS,
  WELDING_DELETE_FAILURE,
  INVALIDATE_WELDINGS
} from "./types";
import { applyFilterSort } from "./filterSortActions";

// fetch weldings
const fetchWeldingsBegin = () => ({
  type: FETCH_WELDGINS_BEGIN
});

const fetchWeldingsSuccess = weldings => ({
  type: FETCH_WELDINGS_SUCCESS,
  payload: { weldings }
});

const fetchWeldingsFailure = error => ({
  type: FETCH_WELDINGS_FAILURE,
  payload: { error }
});

export const fetchWeldings = () => (dispatch, getState) => {
  dispatch(fetchWeldingsBegin());
  axios
    .get("/api/weldings")
    .then(res => {
      dispatch(fetchWeldingsSuccess(res.data));
      const fetchedWeldings = getState().allWeldings;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      // console.log("weldingsActions.fetchWeldings filterText, sortText", filterText, sortText, fetchedWeldings.length);
      dispatch(applyFilterSort(fetchedWeldings, filterText, sortText));
    })
    .catch(err => dispatch(fetchWeldingsFailure(err)));
};

export const invalidateWeldings = () => (dispatch) => {
  dispatch({type: INVALIDATE_WELDINGS});
}

// insert welding
const weldingInsertBegin = () => ({
  type: WELDING_INSERT_BEGIN
});

const weldingInsertSuccess = data => ({
  type: WELDING_INSERT_SUCCESS,
  payload: data
});

const weldingInsertFailure = error => ({
  type: WELDING_INSERT_FAILURE,
  payload: { error }
});

export const insertWelding = weldingDraft => (dispatch, getState) => {
  dispatch(weldingInsertBegin());
  axios
    .put("/api/weldings/insert", { draft: weldingDraft })
    .then(res => {
      dispatch(weldingInsertSuccess(res.data));
      const fetchedWeldings = getState().allWeldings;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      dispatch(applyFilterSort(fetchedWeldings, filterText, sortText));
    })
    .catch(err => dispatch(weldingInsertFailure(err)));
};

// edit welding
const weldingUpdateBegin = () => ({
  type: WELDING_UPDATE_BEGIN
});

const weldingUpdateSuccess = data => ({
  type: WELDING_UPDATE_SUCCESS,
  payload: data
});

const weldingUpdateFailure = error => ({
  type: WELDING_UPDATE_FAILURE,
  payload: { error }
});

export const updateWelding = (weldingDraft, history) => (dispatch, getState) => {
  dispatch(weldingUpdateBegin());
  axios
    .post("/api/weldings/update", { draft: weldingDraft })
    .then(res => {
      dispatch(weldingUpdateSuccess(res.data));
      const fetchedWeldings = getState().allWeldings;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      dispatch(applyFilterSort(fetchedWeldings, filterText, sortText));
      history.push("/weldings");
    })
    .catch(err => dispatch(weldingUpdateFailure(err)));
};

// delete welding

const weldingDeleteBegin = () => ({
  type: WELDING_DELETE_BEGIN
});

const weldingDeleteSuccess = data => ({
  type: WELDING_DELETE_SUCCESS,
  payload: data // "_id"
});

const weldingDeleteFailure = error => ({
  type: WELDING_DELETE_FAILURE,
  payload: { error }
});

export const deleteWelding = weldingId => (dispatch, getState) => {
  dispatch(weldingDeleteBegin());
  axios
    .delete("/api/weldings/delete", { params: { id: weldingId } })
    .then(res => {
      dispatch(weldingDeleteSuccess(res.data)); // "_id"
      const fetchedWeldings = getState().allWeldings;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      dispatch(applyFilterSort(fetchedWeldings, filterText, sortText));
    })
    .catch(err => dispatch(weldingDeleteFailure(err)));
};

// just filtersort weldings

export const filterSortWeldings = (filterText, sortText) => (
  dispatch,
  getState
) => {
  dispatch(applyFilterSort(getState().allWeldings, filterText, sortText));
};
