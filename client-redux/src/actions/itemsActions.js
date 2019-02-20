import axios from "axios";
import {
  FETCH_ITEMS_BEGIN,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  ITEM_INSERT_BEGIN,
  ITEM_INSERT_SUCCESS,
  ITEM_INSERT_FAILURE,
  ITEM_UPDATE_BEGIN,
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_FAILURE,
  ITEM_DELETE_BEGIN,
  ITEM_DELETE_SUCCESS,
  ITEM_DELETE_FAILURE,
  INVALIDATE_ITEMS,
  ITEMS_FILTERSORT_APPLIED,
  ITEMS_FILTERSORT_APPLY_ERROR,
  ITEM_TOGGLE_FS,
  ITEM_TOGGLE_FS_MANUAL,
  ITEMS_PAGE_CHANGE, 
  ITEMS_PER_PAGE_CHANGE,
  HIDE_ITEMS_ERROR,
  HIDE_ITEMS_WARNING,
  ITEMS_SET_WARNING,
  HIDE_ITEMS_SUCCESS,
  ITEMS_SET_SUCCESS,
  SET_CURRENT_ITEM_TYPE
} from "./types";
import funcCreator from "./functions/filterSort/itemFilterSort";
import itemSpecific from "../itemSpecific";

export const setCurrentItemType = itype => dispatch =>
  dispatch({
    type: SET_CURRENT_ITEM_TYPE,
    payload: {itype}
  });

export const hideWarning = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_WARNING,
    payload: {itype}
  });

export const hideSuccess = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_SUCCESS,
    payload: {itype}
  });

export const hideError = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_ERROR,
    payload: {itype}
  });

export const pageChange = (pageIndex, itemCount, itype) => dispatch =>
  dispatch({
    type: ITEMS_PAGE_CHANGE,
    payload: {itemCount, pageIndex, itype}
  });

export const itemsPerPageChange = (itemsPerPage, itemCount, itype) => dispatch =>
  dispatch({
    type: ITEMS_PER_PAGE_CHANGE,
    payload: {itemCount, itemsPerPage, itype}
  });

export const toggleFS = itype => dispatch => dispatch({
    type: ITEM_TOGGLE_FS,
    payload: {itype}
});

export const toggleFSManual = itype => dispatch => dispatch({
    type: ITEM_TOGGLE_FS_MANUAL,
    payload: {itype}
});

// apply filter and sort and return result action
const applyFilterSort = (items, filterText, sortText, itype) => {
  try {    
    const funcs = funcCreator(filterText, sortText, itype);
    const fsedItems = items.filter(funcs.filter).sort(funcs.sort);
    return { 
      type: ITEMS_FILTERSORT_APPLIED, 
      payload: {items: fsedItems, filterText, sortText, itype} 
    };
  } catch (error) {
    return { 
      type: ITEMS_FILTERSORT_APPLY_ERROR, 
      payload: {error, itype} 
    };
  }
};

// just filtersort items
export const filterSortItems = (filterText, sortText, itype) => (
  dispatch,
  getState
) => {
  dispatch(applyFilterSort(getState().allItems[itype], filterText, sortText, itype));
};

// fetch items
const fetchItemsBegin = itype => ({
  type: FETCH_ITEMS_BEGIN,
  payload: {itype}
});

const fetchItemsSuccess = (items, itype) => ({
  type: FETCH_ITEMS_SUCCESS,
  payload: { items, itype }
});

const fetchItemsFailure = (error, itype) => ({
  type: FETCH_ITEMS_FAILURE,
  payload: { error, itype }
});

export const fetchItems = (itype) => (dispatch, getState) => {
  dispatch(fetchItemsBegin(itype));
  let paramsObj = {params: {itype}};
  if (getState().itemsStatus[itype].all) paramsObj.params.all = 1;
  axios
    .get("api/items", paramsObj)
    .then(res => {
      dispatch(fetchItemsSuccess(res.data, itype));           
      refilter(dispatch, getState, itype);
    })
    .catch(err => dispatch(fetchItemsFailure(err, itype)));
};

export const invalidateItems = (all, itype) => dispatch => {
  dispatch({
    type: INVALIDATE_ITEMS,
    payload: {all, itype}
  });
}

const refilter = (dispatch, getState, itype) => {
  const fetchedItems = getState().allItems[itype];
  const filterText = getState().itemsFS[itype].filterText;
  const sortText = getState().itemsFS[itype].sortText;
  dispatch(applyFilterSort(fetchedItems, filterText, sortText, itype));
}

const setWarning = (message, itype) => ({
    type: ITEMS_SET_WARNING,
    payload: {message, itype}
});

const setSuccess = (message, itype) => ({
    type: ITEMS_SET_SUCCESS,
    payload: {message, itype}
});

// insert item
const itemInsertBegin = itype => ({
  type: ITEM_INSERT_BEGIN,
  payload: {itype}
});

const itemInsertSuccess = (item, itype) => ({
  type: ITEM_INSERT_SUCCESS,
  payload: {item, itype}
});

const itemInsertFailure = (error, itype) => ({
  type: ITEM_INSERT_FAILURE,
  payload: { error, itype }
});

export const insertItem = (draft, itype) => (dispatch, getState) => {
  dispatch(itemInsertBegin(itype));
  axios
    .put("/api/items/insert", {draft, itype})
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message, itype));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message, itype));
      }

      if (
        res.data.data == null || 
        (!getState().itemsStatus[itype].all && res.data.data.panaikinta) 
      ) {  
        dispatch(itemInsertSuccess(itype)); 
      } else {     
        dispatch(itemInsertSuccess(res.data.data, itype));
        refilter(dispatch, getState, itype);
      }
    })
    .catch(err => {
      dispatch(itemInsertFailure(err, itype));
    });
};


// edit item
const itemUpdateBegin = (itype) => ({
  type: ITEM_UPDATE_BEGIN,
  payload: {itype}
});

const itemUpdateSuccess = (item, itype) => ({
  type: ITEM_UPDATE_SUCCESS,
  payload: {item, itype}
});

const itemUpdateFailure = (error, itype) => ({
  type: ITEM_UPDATE_FAILURE,
  payload: { error, itype }
});

export const updateItem = (draft, history, itype) => (dispatch, getState) => {
  dispatch(itemUpdateBegin(itype));
  axios
    .post("/api/items/update", {draft, itype})
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message, itype));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message, itype));
      }

      if (res.data.data != null) {
        if (getState().itemsStatus[itype].all) {
          // jeigu yra data ir rodyti visus - updateinamas local
          dispatch(itemUpdateSuccess(res.data.data, itype));
        } else {          
          if (res.data.data.panaikinta) {
            // jeigu yra data, rodyti tik nepanaikintus, o yra panaikintas -
            // ištrinamas iš local
            dispatch(itemDeleteSuccess(res.data.data._id, itype));
          } else {   
            // jeigu yra data, rodyti tik nepanaikintus, ir nėra panaikintas -
            // updateinamas local
            dispatch(itemUpdateSuccess(res.data.data, itype));
          }
        }
        refilter(dispatch, getState, itype);
      } else {
        // jeigu nėra data - nedaroma nieko
        dispatch(itemUpdateSuccess(itype)); 
      }
      // return to list
      history.push(itemSpecific(itype).listPath);
    })
    .catch(err => {
      dispatch(itemUpdateFailure(err, itype));
    });
};

// delete item

const itemDeleteBegin = (itype) => ({
  type: ITEM_DELETE_BEGIN,
  payload: {itype}
});

const itemDeleteSuccess = (id, itype) => ({
  type: ITEM_DELETE_SUCCESS,
  payload: {id, itype}
});

const itemDeleteFailure = (error, itype) => ({
  type: ITEM_DELETE_FAILURE,
  payload: { error, itype }
});

export const deleteItem = (_itemId, itemV, itype) => (dispatch, getState) => {
  dispatch(itemDeleteBegin(itype));
  axios
    .delete("/api/items/delete", { params: { _id: _itemId, v: itemV, itype } })
    .then(res => {
      if (res.data.case === "warning") {
        dispatch(setWarning(res.data.message, itype));
      } else if (res.data.case === "success") {
        dispatch(setSuccess(res.data.message, itype));
      }

      if (res.data.data) {        
        dispatch(itemDeleteSuccess(res.data.data, itype));
        refilter(dispatch, getState, itype);
      } else {
        dispatch(itemDeleteSuccess(itype));
      }
    })
    .catch(err => {
      dispatch(itemDeleteFailure(err, itype));
    });
};