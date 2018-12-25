import {
  REGISTER_BEGIN, REGISTER_SUCCESS, REGISTER_ERROR
} from "../actions/types";

const initialState = {
  isBusy: false,
  error: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_BEGIN:
      return {
        ...state,
        isBusy: true,
        error: {}
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isBusy: false,
        error: {}
      };

    case REGISTER_ERROR:
      return {
        ...state,
        isBusy: false,
        error: action.payload
      };
    default:
      return state;
  }
}
