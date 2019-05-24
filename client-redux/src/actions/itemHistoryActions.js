import axios from "axios";
import extractMsg from "./functions/extractMsg";
import {
  SHOW_ITEM_HISTORY,
  HIDE_ITEM_HISTORY,
  FETCH_ALL_HISTORY_BEGIN,
  FETCH_ALL_HISTORY_SUCCESS,
  FETCH_ALL_HISTORY_FAILURE,
  HISTORY_ITEM_INSERT_BEGIN,
  HISTORY_ITEM_INSERT_SUCCESS,
  HISTORY_ITEM_INSERT_FAILURE,
  HISTORY_ITEM_UPDATE_BEGIN,
  HISTORY_ITEM_UPDATE_SUCCESS,
  HISTORY_ITEM_UPDATE_FAILURE,
  HISTORY_ITEM_DELETE_BEGIN,
  HISTORY_ITEM_DELETE_SUCCESS,
  HISTORY_ITEM_DELETE_FAILURE,
  HISTORY_ITEMS_SET_ERROR,
  HISTORY_ITEMS_HIDE_ERROR,
  HISTORY_ITEMS_SET_WARNING,
  HISTORY_ITEMS_HIDE_WARNING,
  HISTORY_ITEMS_SET_SUCCESS,
  HISTORY_ITEMS_HIDE_SUCCESS,
  SET_CURRENT_HISTORY_ITEM
} from "./types";
import funcCreator from "./functions/filterSort/itemFilterSort";
import itemSpecific from "../itemSpecific";

export const setCurrentItemType = itype => dispatch =>
  dispatch({
    type: SET_CURRENT_ITEM_TYPE,
    payload: { itype }
  });

export const hideWarning = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_WARNING,
    payload: { itype }
  });

export const hideSuccess = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_SUCCESS,
    payload: { itype }
  });

export const hideSingleItemError = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_ERROR,
    payload: { itype, target: "SINGLE_ITEM" }
  });

export const hideItemListError = itype => dispatch =>
  dispatch({
    type: HIDE_ITEMS_ERROR,
    payload: { itype, target: "ITEM_LIST" }
  });

export const pageChange = (pageIndex, itemCount, itype) => dispatch =>
  dispatch({
    type: ITEMS_PAGE_CHANGE,
    payload: { itemCount, pageIndex, itype }
  });

export const itemsPerPageChange = (
  itemsPerPage,
  itemCount,
  itype
) => dispatch =>
  dispatch({
    type: ITEMS_PER_PAGE_CHANGE,
    payload: { itemCount, itemsPerPage, itype }
  });

export const toggleFS = itype => dispatch =>
  dispatch({
    type: ITEM_TOGGLE_FS,
    payload: { itype }
  });

export const toggleFSManual = itype => dispatch =>
  dispatch({
    type: ITEM_TOGGLE_FS_MANUAL,
    payload: { itype }
  });

// apply filter and sort and return result action
const applyFilterSort = (items, filterText, sortText, itype) => {
  try {
    const funcs = funcCreator(filterText, sortText, itype);
    const fsedItems = items.filter(funcs.filter).sort(funcs.sort);
    return {
      type: ITEMS_FILTERSORT_APPLIED,
      payload: { items: fsedItems, filterText, sortText, itype }
    };
  } catch (error) {
    return {
      type: ITEMS_FILTERSORT_APPLY_ERROR,
      payload: { error, itype }
    };
  }
};

// just filtersort items
export const filterSortItems = (filterText, sortText, itype) => (
  dispatch,
  getState
) => {
  dispatch(
    applyFilterSort(getState().allItems[itype], filterText, sortText, itype)
  );
};

// fetch items
const fetchItemsBegin = itype => ({
  type: FETCH_ITEMS_BEGIN,
  payload: { itype }
});

const fetchItemsSuccess = (items, itype) => ({
  type: FETCH_ITEMS_SUCCESS,
  payload: { items, itype }
});

const fetchItemsFailure = (error, itype) => ({
  type: FETCH_ITEMS_FAILURE,
  payload: { error, itype }
});

export const fetchItems = itype => (dispatch, getState) => {
  dispatch(fetchItemsBegin(itype));
  let paramsObj = { params: { itype } };
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
    payload: { all, itype }
  });
};

const refilter = (dispatch, getState, itype) => {
  const fetchedItems = getState().allItems[itype];
  const filterText = getState().itemsFS[itype].filterText;
  const sortText = getState().itemsFS[itype].sortText;
  dispatch(applyFilterSort(fetchedItems, filterText, sortText, itype));
};

const setWarning = (message, itype) => ({
  type: ITEMS_SET_WARNING,
  payload: { message, itype }
});

const setSuccess = (message, itype) => ({
  type: ITEMS_SET_SUCCESS,
  payload: { message, itype }
});

// insert item
const itemInsertBegin = itype => ({
  type: ITEM_INSERT_BEGIN,
  payload: { itype }
});

const itemInsertSuccess = (item, itype) => ({
  type: ITEM_INSERT_SUCCESS,
  payload: { item, itype }
});

const itemInsertFailure = (errormsg, itype, target) => ({
  type: ITEM_INSERT_FAILURE,
  payload: { errormsg, itype, target }
});

export const insertItem = (draft, history, itype) => (dispatch, getState) => {
  // console.log("inserting item");
  dispatch(itemInsertBegin(itype));
  axios
    .put("/api/items/insert", { draft, itype })
    .then(res => {
      // suformuojamas pranešimas apie rezultatą
      // console.log("inserting item response", res.data);
      if (res.data.ok) {
        dispatch(setSuccess(res.data.msg, itype));
      } else {
        dispatch(setWarning(res.data.msg, itype));
      }

      // pagal rezultatą updateinamas local cache
      if (
        getState().itemsStatus[itype].all ||
        !itemSpecific(itype).panaikinta(res.data.item)
      ) {
        // jeigu rodyti visus (ir panaikintus, ir ne) ARBA
        // jeigu buvo sukurtas nepanaikintas -
        // updateinamas local cache ir refilter
        dispatch(itemInsertSuccess(res.data.item, itype));
        refilter(dispatch, getState, itype);
      }
    })
    .catch(err => {
      const error = JSON.parse(JSON.stringify(err));
      const errmsg = extractMsg(error);
      // console.log("error-msg", errmsg);

      if (
        error.response &&
        error.response.data &&
        err.response.data.reason === "bad criteria"
      ) {
        // console.log("insert item error path1");
        dispatch(itemInsertFailure(errmsg, itype, "ITEM_LIST"));
        history.push(itemSpecific(itype).listPath);
      } else {
        // console.log("insert item error path2");
        dispatch(itemInsertFailure(errmsg, itype, "SINGLE_ITEM"));
      }
    });
};

// edit item
const itemUpdateBegin = itype => ({
  type: ITEM_UPDATE_BEGIN,
  payload: { itype }
});

const itemUpdateSuccess = (item, itype) => ({
  type: ITEM_UPDATE_SUCCESS,
  payload: { item, itype }
});

const itemUpdateFailure = (errormsg, itype, target) => ({
  type: ITEM_UPDATE_FAILURE,
  payload: { errormsg, itype, target }
});

export const updateItem = (draft, history, itype) => (dispatch, getState) => {
  dispatch(itemUpdateBegin(itype));
  axios
    .post("/api/items/update", { draft, itype })
    .then(res => {
      // console.log("res.data", res.data);

      // suformuojamas pranešimas apie rezultatą
      if (res.data.ok) {
        dispatch(setSuccess(res.data.msg, itype));
      } else {
        dispatch(setWarning(res.data.msg, itype));
      }

      // pagal rezultatą updateinamas local cache
      if (getState().itemsStatus[itype].all) {
        // jeigu rodyti visus (ir panaikintus, ir ne) - updateinamas local
        // console.log("perform local action: 1");
        dispatch(itemUpdateSuccess(res.data.item, itype));
      } else {
        // jeigu rodyti tik nepanaikintus
        if (itemSpecific(itype).panaikinta(res.data.item)) {
          // console.log("perform local action: 2");
          // jeigu updateinant buvo panaikintas -
          // ištrinamas iš local
          dispatch(itemDeleteSuccess(res.data.item.id, itype));
        } else {
          // console.log("perform local action: 3");
          // jeigu updateinant nebuvo panaikintas -
          // updateinamas local
          dispatch(itemUpdateSuccess(res.data.item, itype));
        }
      }

      // refilter local cache
      refilter(dispatch, getState, itype);

      // return to list
      history.push(itemSpecific(itype).listPath);
    })
    .catch(err => {
      const error = JSON.parse(JSON.stringify(err));
      const errmsg = extractMsg(error);
      // console.log("error-msg", errmsg);

      if (
        error.response &&
        error.response.data &&
        err.response.data.reason === "bad criteria"
      ) {
        dispatch(itemUpdateFailure(errmsg, itype, "ITEM_LIST"));
        history.push(itemSpecific(itype).listPath);
      } else {
        dispatch(itemUpdateFailure(errmsg, itype, "SINGLE_ITEM"));
      }
    });
};

// delete item

const itemDeleteBegin = itype => ({
  type: ITEM_DELETE_BEGIN,
  payload: { itype }
});

const itemDeleteSuccess = (id, itype) => ({
  type: ITEM_DELETE_SUCCESS,
  payload: { id, itype }
});

const itemDeleteFailure = (errormsg, itype, target) => ({
  type: ITEM_DELETE_FAILURE,
  payload: { errormsg, itype, target }
});

export const deleteItem = (itemId, itemV, itype) => (dispatch, getState) => {
  dispatch(itemDeleteBegin(itype));
  axios
    .delete("/api/items/delete", { params: { id: itemId, v: itemV, itype } })
    .then(res => {
      // console.log("res.data", res.data);
      dispatch(setSuccess(res.data.msg, itype));
      // console.log("going to dispatch itemDeleteSucces");
      dispatch(itemDeleteSuccess(res.data.id, itype));
      // console.log("going to refilter");
      refilter(dispatch, getState, itype);
    })
    .catch(err => {
      const error = JSON.parse(JSON.stringify(err));
      const errmsg = extractMsg(error);
      // console.log("error-msg", errmsg);

      dispatch(itemDeleteFailure(errmsg, itype, "ITEM_LIST"));
    });
};
