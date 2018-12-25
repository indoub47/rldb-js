import isEmpty from "../validation/is-empty";
import { SET_CURRENT_USER, LOGIN_BEGIN, LOGIN_ERROR, LOGOUT } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  isBusy: false,
  error: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        isBusy: true,
        user: {},
        error: {},
        isAuthenticated: false
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        isBusy: false,
        error: {}
      };

    case LOGIN_ERROR:
      return {
        ...state,
        isBusy: false,
        user: {},
        error: action.payload,
        isAuthenticated: false
      };

    case LOGOUT:
      return {...initialState};
      
    default:
      return state;
  }
}
