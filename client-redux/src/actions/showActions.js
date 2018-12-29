import {
  TOGGLE_FS,
  TOGGLE_FS_MANUAL
} from "./types";

export const toggleFS = (thingType) => dispatch => dispatch({
    type: TOGGLE_FS,
    payload: {thingType}
});

export const toggleFSManual = (thingType) => dispatch => dispatch({
    type: TOGGLE_FS_MANUAL,
    payload: {thingType}
});

