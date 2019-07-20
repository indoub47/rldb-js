import axios from "axios";
import {
  IAPPROVE_FETCH_BEGIN,
  IAPPROVE_FETCH_SUCCESS,
  IAPPROVE_FETCH_FAILURE,
  IAPPROVE_PROCESS_BEGIN,
  IAPPROVE_PROCESS_SUCCESS,
  IAPPROVE_PROCESS_FAILURE,
  IAPPROVE_INFO_REMOVE,
  IAPPROVE_SET_NOTE,
  IAPPROVE_SET_ACTION
} from "./types";

export const dispatchRemoveInfo = () => dispatch => {
  dispatch({ type: IAPPROVE_INFO_REMOVE });
};

const fetchIApproveBegin = () => ({
  type: IAPPROVE_FETCH_BEGIN
});

const fetchIApproveSuccess = items => ({
  type: IAPPROVE_FETCH_SUCCESS,
  payload: { items }
});

const fetchIApproveFailure = errormsg => ({
  type: IAPPROVE_FETCH_FAILURE,
  payload: { errormsg }
});

export const fetchSuppliedOperInput = itype => dispatch => {
  dispatch(fetchIApproveBegin());
  axios
    .get("/api/operinput/supplied", { params: { itype } })
    .then(res => {
      console.log("supplied", res.data);
      //const parsed = unpack(res.data, "supplied");
      dispatch(fetchIApproveSuccess(res.data));
    })
    .catch(err => {
      console.error(err);
      dispatch(fetchIApproveFailure(err.message));
    });
};

const iApproveProcessBegin = () => ({
  type: IAPPROVE_PROCESS_BEGIN
});

const iApproveProcessSuccess = info => ({
  type: IAPPROVE_PROCESS_SUCCESS,
  payload: { info }
});

const iApproveProcessFailure = errormsg => ({
  type: IAPPROVE_PROCESS_FAILURE,
  payload: { errormsg }
});

export const submitIApprove = (input, itype) => dispatch => {
  dispatch(iApproveProcessBegin());
  axios
    .post("/api/operinput/process-approved", {
      input: input.filter(i => i.action !== "none"),
      itype
    })
    .then(res => {
      console.log(res.data);
      dispatch(iApproveProcessSuccess(res.data));
    })
    .catch(err => {
      // to neturėtų būti, nes visos klaidos išgaudomos
      console.error(err);
      dispatch(iApproveProcessFailure(err.message));
    })
    .finally(() => {
      fetchSuppliedOperInput(itype);
    });
};

export const setAction = (value, index) => dispatch => {
  dispatch({ type: IAPPROVE_SET_ACTION, payload: { value, index } });
};

export const setNote = (value, index) => dispatch => {
  dispatch({ type: IAPPROVE_SET_NOTE, payload: { value, index } });
};
