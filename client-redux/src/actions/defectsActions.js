import axios from "axios";
import {
  FETCH_DEFECTS_BEGIN,
  FETCH_DEFECTS_SUCCESS,
  FETCH_DEFECTS_FAILURE, 

  DEFECT_INSERT_BEGIN,
  DEFECT_INSERT_SUCCESS,
  DEFECT_INSERT_FAILURE, 

  DEFECT_UPDATE_BEGIN,
  DEFECT_UPDATE_SUCCESS,
  DEFECT_UPDATE_FAILURE, 
  
  DEFECT_DELETE_BEGIN,
  DEFECT_DELETE_SUCCESS,
  DEFECT_DELETE_NOT_FOUND,
  DEFECT_DELETE_FAILURE,

  //DEFECT_SHOW_HISTORY
} from "./types";
import {applyFilterSort} from './filterSortActions'

// fetch defects
const fetchDefectsBegin = () => ({
  type: FETCH_DEFECTS_BEGIN
});

const fetchDefectsSuccess = defects => ({
  type: FETCH_DEFECTS_SUCCESS,
  payload: {defects}
});

const fetchDefectsFailure = error => ({
  type: FETCH_DEFECTS_FAILURE,
  payload: {error}
});

export const fetchDefects = () => (dispatch, getState) => {
  dispatch(fetchDefectsBegin());
  axios
    .get("/api/defects")
    .then(res => {
      dispatch(fetchDefectsSuccess(res.data));
      const fetchedDefects = getState().allDefects;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      // console.log("defectsActions.fetchDefects filterText, sortText", filterText, sortText, fetchedDefects.length);
      dispatch(applyFilterSort(fetchedDefects, filterText, sortText));
    })
    .catch(err => dispatch(fetchDefectsFailure(err)));
};


// insert defect
const defectInsertBegin = () => ({
  type: DEFECT_INSERT_BEGIN
})

const defectInsertSuccess = data => ({
  type: DEFECT_INSERT_SUCCESS,
  payload: data // {result, versionError, version}
});

const defectInsertFailure = error => ({
  type:  DEFECT_INSERT_FAILURE,
  payload: { error }
}); 

export const insertDefect = defectDraft => (dispatch, getState) => {
  dispatch(defectInsertBegin());
  axios
    .put("/api/defects/insert", {draft: defectDraft})
    .then(res => {
      dispatch(defectInsertSuccess(res.data)); // {result, versionError, version}
      const fetchedDefects = getState().allDefects;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      dispatch(applyFilterSort(fetchedDefects, filterText, sortText));
    })
    .catch(err => dispatch(defectInsertFailure(err)));
};


// edit defect
const defectUpdateBegin = () => ({
  type: DEFECT_UPDATE_BEGIN
});

const defectUpdateSuccess = data => ({
  type: DEFECT_UPDATE_SUCCESS,
  payload: data // {result, versionError, version}
});

const defectUpdateFailure = error => ({
  type:  DEFECT_UPDATE_FAILURE,
  payload: {error}
}); 

export const updateDefect = (defectDraft, history) => (dispatch, getState) => {
  dispatch(defectUpdateBegin());
  axios
    .post("/api/defects/update", {draft: defectDraft})
    .then(res => {
      dispatch(defectUpdateSuccess(res.data)); // {result, versionError, version}
      const fetchedDefects = getState().allDefects;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      dispatch(applyFilterSort(fetchedDefects, filterText, sortText));      
      history.push("/defects");
    })
    .catch(err => dispatch(defectUpdateFailure(err)));
};


// delete defect

const defectDeleteBegin = () => ({
  type: DEFECT_DELETE_BEGIN
});

const defectDeleteSuccess = data => ({
  type: DEFECT_DELETE_SUCCESS,
  payload: data // {result(defectId), versionError, version}
});

const defectDeleteFailure = error => ({
  type:  DEFECT_DELETE_FAILURE,
  payload: { error }
});

export const deleteDefect = defectId => (dispatch, getState) => {
  dispatch(defectDeleteBegin());
  axios
    .delete("/api/defects/delete", {params: {id: defectId}})
    .then(res => {
      dispatch(defectDeleteSuccess(res.data)); // {result(defectId), versionError, version}
      const fetchedDefects = getState().allDefects;
      const filterText = getState().filterSort.filterText;
      const sortText = getState().filterSort.sortText;
      dispatch(applyFilterSort(fetchedDefects, filterText, sortText));
    })
    .catch(err => dispatch(defectDeleteFailure(err)));
};


// just filtersort defects

export const filterSortDefects = (filterText, sortText) => (dispatch, getState) => {
  dispatch(applyFilterSort(getState().allDefects, filterText, sortText));
};