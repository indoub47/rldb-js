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
  DEFECT_DELETE_FAILURE,
  INVALIDATE_DEFECTS,
  DEFECTS_FILTERSORT_APPLIED,
  DEFECTS_FILTERSORT_APPLY_ERROR,
  DEFECT_TOGGLE_FS,
  DEFECT_TOGGLE_FS_MANUAL,
  DEFECTS_PAGE_CHANGE, 
  DEFECTS_PER_PAGE_CHANGE,
  HIDE_DEFECTS_ERROR,
  HIDE_DEFECTS_WARNING,
  DEFECTS_SET_WARNING,
  HIDE_DEFECTS_SUCCESS,
  DEFECTS_SET_SUCCESS
} from "./types";
import {
  filterFuncCreator,
  sortFuncCreator
} from "./functions/filterSort/defectFilterSort";

export const hideWarning = () => dispatch =>
  dispatch({
    type: HIDE_DEFECTS_WARNING
  });

export const hideSuccess = () => dispatch =>
  dispatch({
    type: HIDE_DEFECTS_SUCCESS
  });

export const hideError = () => dispatch =>
  dispatch({
    type: HIDE_DEFECTS_ERROR
  });

export const pageChange = (pageIndex, itemCount) => dispatch =>
  dispatch({
    type: DEFECTS_PAGE_CHANGE,
    payload: {itemCount, pageIndex}
  });

export const itemsPerPageChange = (itemsPerPage, itemCount) => dispatch =>
  dispatch({
    type: DEFECTS_PER_PAGE_CHANGE,
    payload: {itemCount, itemsPerPage}
  });

export const toggleFS = () => dispatch => dispatch({
    type: DEFECT_TOGGLE_FS
});

export const toggleFSManual = () => dispatch => dispatch({
    type: DEFECT_TOGGLE_FS_MANUAL
});

// apply filter and sort and return result action
const applyFilterSort = (items, filterText, sortText) => {
  try {    
    const filterFunc = filterFuncCreator(filterText);
    const sortFunc = sortFuncCreator(sortText);
    const fsedItems = items.filter(filterFunc).sort(sortFunc);
    return { 
      type: DEFECTS_FILTERSORT_APPLIED, 
      payload: {items: fsedItems, filterText, sortText} 
    };
  } catch (error) {
    return { 
      type: DEFECTS_FILTERSORT_APPLY_ERROR, 
      payload: {error} 
    };
  }
};

// just filtersort defects
export const filterSortDefects = (filterText, sortText) => (
  dispatch,
  getState
) => {
  dispatch(applyFilterSort(getState().allDefects, filterText, sortText));
};

// fetch defects
const fetchDefectsBegin = () => ({
  type: FETCH_DEFECTS_BEGIN
});

const fetchDefectsSuccess = defects => ({
  type: FETCH_DEFECTS_SUCCESS,
  payload: { defects }
});

const fetchDefectsFailure = error => ({
  type: FETCH_DEFECTS_FAILURE,
  payload: { error }
});

export const fetchDefects = () => (dispatch, getState) => {
  dispatch(fetchDefectsBegin());
  let endPoint = "/api/defects";
  if (getState().defectsStatus.all) endPoint = endPoint + "/all";
  axios
    .get(endPoint)
    .then(res => {
      dispatch(fetchDefectsSuccess(res.data));           
      refilter(dispatch, getState);
    })
    .catch(err => dispatch(fetchDefectsFailure(err)));
};

export const invalidateDefects = all => dispatch => {
  dispatch({
    type: INVALIDATE_DEFECTS,
    payload: {all}
  });
}

const refilter = (dispatch, getState) => {
  const fetchedDefects = getState().allDefects;
  const filterText = getState().defectsFS.filterText;
  const sortText = getState().defectsFS.sortText;
  dispatch(applyFilterSort(fetchedDefects, filterText, sortText));
}

const setWarning = message => ({
    type: DEFECTS_SET_WARNING,
    payload: {message}
});

const setSuccess = message => ({
    type: DEFECTS_SET_SUCCESS,
    payload: {message}
});

// insert defect
const defectInsertBegin = () => ({
  type: DEFECT_INSERT_BEGIN
});

const defectInsertSuccess = data => ({
  type: DEFECT_INSERT_SUCCESS,
  payload: data
});

const defectInsertFailure = error => ({
  type: DEFECT_INSERT_FAILURE,
  payload: { error }
});

export const insertDefect = draft => (dispatch, getState) => {
  dispatch(defectInsertBegin());
  axios
    .put("/api/defects/insert", {draft})
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message));
      }

      if (
        res.data.data == null || 
        (!getState().defectsStatus.all && res.data.data.panaikinta) 
      ) {  
        dispatch(defectInsertSuccess()); 
      } else {     
        dispatch(defectInsertSuccess(res.data.data));
        refilter(dispatch, getState);
      }
    })
    .catch(err => {
      dispatch(defectInsertFailure(err));
    });
};


// edit defect
const defectUpdateBegin = () => ({
  type: DEFECT_UPDATE_BEGIN
});

const defectUpdateSuccess = data => ({
  type: DEFECT_UPDATE_SUCCESS,
  payload: data
});

const defectUpdateFailure = error => ({
  type: DEFECT_UPDATE_FAILURE,
  payload: { error }
});

export const updateDefect = (draft, history) => (dispatch, getState) => {
  dispatch(defectUpdateBegin());
  axios
    .post("/api/defects/update", {draft})
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message));
      }

      if (res.data.data != null) {
        if (getState().defectsStatus.all) {
          // jeigu yra data ir rodyti visus - updateinamas
          dispatch(defectUpdateSuccess(res.data.data));
        } else {          
          if (res.data.data.panaikinta) {
            // jeigu yra data, rodyti tik nepanaikintus, o yra panaikintas -
            // ištrinamas
            dispatch(defectDeleteSuccess(res.data.data._id));
          } else {   
            // jeigu yra data, rodyti tik nepanaikintus, ir nėra panaikintas -
            // updateinamas 
            dispatch(defectUpdateSuccess(res.data.data));
          }
        }
        refilter(dispatch, getState);
      } else {
        // jeigu nėra data - nedaroma nieko
        dispatch(defectUpdateSuccess()); 
      }
      history.push("/defects");
    })
    .catch(err => {
      dispatch(defectUpdateFailure(err));
    });
};

// delete defect

const defectDeleteBegin = () => ({
  type: DEFECT_DELETE_BEGIN
});

const defectDeleteSuccess = data => ({
  type: DEFECT_DELETE_SUCCESS,
  payload: data // "_id"
});

const defectDeleteFailure = error => ({
  type: DEFECT_DELETE_FAILURE,
  payload: { error }
});

export const deleteDefect = (_defectId, defectV) => (dispatch, getState) => {
  dispatch(defectDeleteBegin());
  axios
    .delete("/api/defects/delete", { params: { _id: _defectId, v: defectV } })
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message));
      }

      if (res.data.data) {        
        dispatch(defectDeleteSuccess(res.data.data));
        refilter(dispatch, getState);
      } else {
        dispatch(defectDeleteSuccess());
      }
    })
    .catch(err => {
      dispatch(defectDeleteFailure(err));
    });
};