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
  INVALIDATE_WELDINGS,
  WELDINGS_FILTERSORT_APPLIED,
  WELDINGS_FILTERSORT_APPLY_ERROR,
  WELDING_TOGGLE_FS,
  WELDING_TOGGLE_FS_MANUAL,
  WELDINGS_PAGE_CHANGE, 
  WELDINGS_PER_PAGE_CHANGE,
  HIDE_WELDINGS_ERROR,
  HIDE_WELDINGS_WARNING,
  WELDINGS_SET_WARNING,
  HIDE_WELDINGS_SUCCESS,
  WELDINGS_SET_SUCCESS
} from "./types";
import {
  filterFuncCreator,
  sortFuncCreator
} from "./functions/filterSort/weldingFilterSort";

export const hideWarning = () => dispatch =>
  dispatch({
    type: HIDE_WELDINGS_WARNING
  });

export const hideSuccess = () => dispatch =>
  dispatch({
    type: HIDE_WELDINGS_SUCCESS
  });

export const hideError = () => dispatch =>
  dispatch({
    type: HIDE_WELDINGS_ERROR
  });

export const pageChange = (pageIndex, itemCount) => dispatch =>
  dispatch({
    type: WELDINGS_PAGE_CHANGE,
    payload: {itemCount, pageIndex}
  });

export const itemsPerPageChange = (itemsPerPage, itemCount) => dispatch =>
  dispatch({
    type: WELDINGS_PER_PAGE_CHANGE,
    payload: {itemCount, itemsPerPage}
  });

export const toggleFS = () => dispatch => dispatch({
    type: WELDING_TOGGLE_FS
});

export const toggleFSManual = () => dispatch => dispatch({
    type: WELDING_TOGGLE_FS_MANUAL
});

// apply filter and sort and return result action
const applyFilterSort = (items, filterText, sortText) => {
  try {    
    const filterFunc = filterFuncCreator(filterText);
    const sortFunc = sortFuncCreator(sortText);
    const fsedItems = items.filter(filterFunc).sort(sortFunc);
    return { 
      type: WELDINGS_FILTERSORT_APPLIED, 
      payload: {items: fsedItems, filterText, sortText} 
    };
  } catch (error) {
    return { 
      type: WELDINGS_FILTERSORT_APPLY_ERROR, 
      payload: {error} 
    };
  }
};

// just filtersort weldings
export const filterSortWeldings = (filterText, sortText) => (
  dispatch,
  getState
) => {
  dispatch(applyFilterSort(getState().allWeldings, filterText, sortText));
};

// fetch weldings
const fetchWeldingsBegin = () => ({
  type: FETCH_WELDINGS_BEGIN
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
  let endPoint = "/api/weldings";
  if (getState().weldingsStatus.all) endPoint = endPoint + "/all";
  axios
    .get(endPoint)
    .then(res => {
      dispatch(fetchWeldingsSuccess(res.data));           
      refilter(dispatch, getState);
    })
    .catch(err => dispatch(fetchWeldingsFailure(err)));
};

export const invalidateWeldings = all => dispatch => {
  dispatch({
    type: INVALIDATE_WELDINGS,
    payload: {all}
  });
}

const refilter = (dispatch, getState) => {
  const fetchedWeldings = getState().allWeldings;
  const filterText = getState().weldingsFS.filterText;
  const sortText = getState().weldingsFS.sortText;
  dispatch(applyFilterSort(fetchedWeldings, filterText, sortText));
}

const setWarning = message => ({
    type: WELDINGS_SET_WARNING,
    payload: {message}
});

const setSuccess = message => ({
    type: WELDINGS_SET_SUCCESS,
    payload: {message}
});

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

export const insertWelding = draft => (dispatch, getState) => {
  dispatch(weldingInsertBegin());
  axios
    .put("/api/weldings/insert", {draft})
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message));
      }

      if (
        res.data.data == null || 
        (!getState().weldingsStatus.all && res.data.data.panaikinta) 
      ) {  
        dispatch(weldingInsertSuccess()); 
      } else {     
        dispatch(weldingInsertSuccess(res.data.data));
        refilter(dispatch, getState);
      }
    })
    .catch(err => {
      dispatch(weldingInsertFailure(err));
    });
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

export const updateWelding = (draft, history) => (dispatch, getState) => {
  dispatch(weldingUpdateBegin());
  axios
    .post("/api/weldings/update", {draft})
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message));
      }

      if (res.data.data != null) {
        if (getState().weldingsStatus.all) {
          // jeigu yra data ir rodyti visus - updateinamas
          dispatch(weldingUpdateSuccess(res.data.data));
        } else {          
          if (res.data.data.panaikinta) {
            // jeigu yra data, rodyti tik nepanaikintus, o yra panaikintas -
            // ištrinamas
            dispatch(weldingDeleteSuccess(res.data.data._id));
          } else {   
            // jeigu yra data, rodyti tik nepanaikintus, ir nėra panaikintas -
            // updateinamas 
            dispatch(weldingUpdateSuccess(res.data.data));
          }
        }
        refilter(dispatch, getState);
      } else {
        // jeigu nėra data - nedaroma nieko
        dispatch(weldingUpdateSuccess()); 
      }
      history.push("/weldings");
    })
    .catch(err => {
      dispatch(weldingUpdateFailure(err));
    });
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

export const deleteWelding = (_weldingId, weldingV) => (dispatch, getState) => {
  dispatch(weldingDeleteBegin());
  axios
    .delete("/api/weldings/delete", { params: { _id: _weldingId, v: weldingV } })
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message));
      }

      if (res.data.data) {        
        dispatch(weldingDeleteSuccess(res.data.data));
        refilter(dispatch, getState);
      } else {
        dispatch(weldingDeleteSuccess());
      }
    })
    .catch(err => {
      dispatch(weldingDeleteFailure(err));
    });
};