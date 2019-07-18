import axios from "axios";
import {
  OPERINPUT_FETCH_BEGIN,
  OPERINPUT_FETCH_SUCCESS,
  OPERINPUT_FETCH_FAILURE,
  OPERINPUT_SUPPLY_BEGIN,
  OPERINPUT_SUPPLY_SUCCESS,
  OPERINPUT_SUPPLY_FAILURE,
  OPERINPUT_INSERT_BEGIN,
  OPERINPUT_INSERT_SUCCESS,
  OPERINPUT_INSERT_FAILURE,
  OPERINPUT_ITEMS_SEARCH_BEGIN,
  OPERINPUT_ITEMS_SEARCH_SUCCESS,
  OPERINPUT_ITEMS_SEARCH_FAILURE,
  OPERINPUT_CLEAR,
  OPERINPUT_DELETE_WE_BEGIN,
  OPERINPUT_DELETE_WE_SUCCESS,
  OPERINPUT_DELETE_WE_FAILURE,
  OPERINPUT_FETCH_WE_BEGIN,
  OPERINPUT_FETCH_WE_SUCCESS,
  OPERINPUT_FETCH_WE_FAILURE,
  OPERINPUT_WE_CLEAR,
  OPERINPUT_INFO_REMOVE,
  OPERINPUT_SEARCH_INFO_REMOVE,
  OPERINPUT_SET_ITEMS
} from "./types";
import { unpack } from "./functions/unpack";

export const setItems = (items) => dispatch => {
  dispatch({type: OPERINPUT_SET_ITEMS, payload: {items}});
}

const removeInfo = () => ({ type: OPERINPUT_INFO_REMOVE });

export const dispatchRemoveInfo = () => dispatch => {
  dispatch(removeInfo());
};

const removeSearchInfo = () => ({ type: OPERINPUT_SEARCH_INFO_REMOVE });

export const dispatchRemoveSearchInfo = () => dispatch => {
  dispatch(removeSearchInfo());
};

const fetchOperInputBegin = () => ({
  type: OPERINPUT_FETCH_BEGIN
});

const fetchOperInputSuccess = items => ({
  type: OPERINPUT_FETCH_SUCCESS,
  payload: { items }
});

const fetchOperInputFailure = errormsg => ({
  type: OPERINPUT_FETCH_FAILURE,
  payload: { errormsg }
});

export const fetchSuppliedOperInput = itype => dispatch => {
  dispatch(fetchOperInputBegin());
  axios
    .get("/api/operinput/supplied", { params: { itype } })
    .then(res => {
      console.log("supplied", res.data);
      //const parsed = unpack(res.data, "supplied");
      dispatch(fetchOperInputSuccess(res.data));
    })
    .catch(err => {
      console.error(err);
      dispatch(fetchOperInputFailure(err.message));
    });
};

const fetchOperInputWEBegin = () => ({
  type: OPERINPUT_FETCH_WE_BEGIN
});

const fetchOperInputWESuccess = items => ({
  type: OPERINPUT_FETCH_WE_SUCCESS,
  payload: { items }
});

const fetchOperInputWEFailure = errormsg => ({
  type: OPERINPUT_FETCH_WE_FAILURE,
  payload: { errormsg }
});

export const fetchWEOperInput = itype => dispatch => {
  dispatch(fetchOperInputWEBegin());
  const paramsObj = { params: { itype } };
  axios
    .get("/api/operinput/we", paramsObj)
    .then(res => {
      dispatch(fetchOperInputWESuccess(res.data));
    })
    .catch(err => {
      console.error(err);
      dispatch(fetchOperInputWEFailure(err.message));
    });
};

export const fetchUnapprovedOperInput = itype => dispatch => {
  dispatch(fetchOperInputBegin());
  const paramsObj = { params: { itype } };
  axios
    .get("/api/operinput/unapproved", paramsObj)
    .then(res => {
      //console.log("unapproved response", res.data);      
      const parsed = unpack(res.data, "unapproved");
      //console.log("unapproved parsed", parsed);
      dispatch(fetchOperInputSuccess(parsed));
    })
    .catch(err => {
      console.error(err);
      dispatch(fetchOperInputFailure(err.message));
    });
};

const searchItemsBegin = () => ({
  type: OPERINPUT_ITEMS_SEARCH_BEGIN
});

const searchItemsSuccess = items => ({
  type: OPERINPUT_ITEMS_SEARCH_SUCCESS,
  payload: { items }
});

const searchItemsFailure = (msg, type) => ({
  type: OPERINPUT_ITEMS_SEARCH_FAILURE,
  payload: { msg, type }
});

export const searchItems = (itype, filter) => dispatch => {
  dispatch(removeSearchInfo());
  dispatch(searchItemsBegin());
  axios
    .get("/api/items/search/location", { params: { itype, ...filter } })
    .then(res => {
      dispatch(searchItemsSuccess(res.data));
    })
    .catch(err => {
      let msg;
      let type = "error";
      if (err.response && err.response.data) {
        if (err.response.data.ok) type = "info";
        msg = err.response.data.msg;
      } else {
        console.error(err);
        msg = err.toString();
      }
      dispatch(searchItemsFailure(msg, type));
    });
};

const operInputSupplyBegin = () => ({
  type: OPERINPUT_SUPPLY_BEGIN
});

const operInputSupplySuccess = () => ({
  type: OPERINPUT_SUPPLY_SUCCESS
});

const operInputSupplyFailure = errormsg => ({
  type: OPERINPUT_SUPPLY_FAILURE,
  payload: { errormsg }
});

export const supplyOperInput = (input, itype) => dispatch => {
  dispatch(operInputSupplyBegin());
  axios
    .post("/api/operinput/supply", { input, itype })
    .then(res => {
      dispatch(operInputSupplySuccess());
    })
    .catch(err => {
      console.error(err);
      dispatch(operInputSupplyFailure(err.message));
    });
};

const operInputInsertBegin = () => ({
  type: OPERINPUT_INSERT_BEGIN
});

const operInputInsertSuccess = uninserted => ({
  type: OPERINPUT_INSERT_SUCCESS,
  payload: { uninserted }
});

const operInputInsertFailure = errormsg => ({
  type: OPERINPUT_INSERT_FAILURE,
  payload: { errormsg }
});

export const submitOperInput = (input, itype) => dispatch => {
  console.log("itype", itype);

  dispatch(operInputInsertBegin());
  axios
    .put("/api/operinput/insert", { input, itype })
    .then(res => {
      dispatch(operInputInsertSuccess(res.data));
    })
    .catch(err => {
      console.error(err);
      dispatch(operInputInsertFailure(err.message));
    });
};

const operInputDeleteWEBegin = () => ({
  type: OPERINPUT_DELETE_WE_BEGIN
});

const operInputDeleteWESuccess = id => ({
  type: OPERINPUT_DELETE_WE_SUCCESS,
  payload: { id }
});

const operInputDeleteWEFailure = errormsg => ({
  type: OPERINPUT_DELETE_WE_FAILURE,
  payload: { errormsg }
});

export const operInputDeleteWE = (id, itype) => dispatch => {
  dispatch(operInputDeleteWEBegin());
  axios
    .put("/api/operinput/delete-we", { params: { id, itype } })
    .then(res => {
      dispatch(operInputDeleteWESuccess(res.data));
    })
    .catch(err => {
      console.error(err);
      dispatch(operInputDeleteWEFailure(err.message));
    });
};

export const clearOperInput = () => dispatch => {
  dispatch({ type: OPERINPUT_CLEAR });
};

export const clearWEOperInput = () => dispatch => {
  dispatch({ type: OPERINPUT_WE_CLEAR });
};
