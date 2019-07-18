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
  OPERINPUT_DELETE_WE_BEGIN,
  OPERINPUT_DELETE_WE_FAILURE,
  OPERINPUT_DELETE_WE_SUCCESS,
  OPERINPUT_FETCH_WE_BEGIN,
  OPERINPUT_FETCH_WE_SUCCESS,
  OPERINPUT_FETCH_WE_FAILURE,
  OPERINPUT_WE_CLEAR,
  OPERINPUT_CLEAR,
  OPERINPUT_INFO_REMOVE,
  OPERINPUT_SEARCH_INFO_REMOVE,
  OPERINPUT_SET_ITEMS,
  LOGOUT
} from "../actions/types";

const stateObj = {
  items: [],
  foundItems: [],
  weItems: [],
  isLoading: false,
  info: null,
  searchInfo: null,
};

const initialState = {...stateObj};

export default function(state = initialState, action) {
  switch (action.type) {
    case OPERINPUT_FETCH_BEGIN:
    case OPERINPUT_SUPPLY_BEGIN:
    case OPERINPUT_INSERT_BEGIN:
    case OPERINPUT_FETCH_WE_BEGIN:
    case OPERINPUT_DELETE_WE_BEGIN:
      return {
        ...state,
        info: null,
        isLoading: true       
      };
    
    case OPERINPUT_ITEMS_SEARCH_BEGIN:
      return {
        ...state,
        searchInfo: null,
        isLoading: true       
      };

    case OPERINPUT_SET_ITEMS:
      return {
        ...state,
        items: action.payload.items
      }
    
    case OPERINPUT_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload.items,
        isLoading: false
      };

    case OPERINPUT_ITEMS_SEARCH_SUCCESS:
      return {
        ...state,
        foundItems: action.payload.items,
        isLoading: false
      };
    
    case OPERINPUT_SUPPLY_SUCCESS:
      return {
        ...state,
        items: [],
        isLoading: false,
        info: {message: "Įrašai sėkmingai pateikti", type: "success"}
      }; 
      
    case OPERINPUT_INSERT_SUCCESS:
      return {
        ...state,
        items: action.payload.uninserted,
        isLoading: false,
        info: {message: "Pateikti įrašai sėkmingai įkelti", type: "success"}
      };
    
    case OPERINPUT_FETCH_WE_SUCCESS:
      return {
        ...state,
        weItems: action.payload.items,
        isLoading: false
      };
    
    case OPERINPUT_DELETE_WE_SUCCESS:
      const id = action.payload.id;
      const ind = state.weItems.find(i => i.id === id);
      const weItems = [
        ...state.weItems.slice(0, ind),
        ...state.weItems.slice(ind + 1)
      ];
      return {
        ...state,
        weItems,
        isLoading: false
      };
    
    case OPERINPUT_FETCH_FAILURE:
    case OPERINPUT_SUPPLY_FAILURE:
    case OPERINPUT_INSERT_FAILURE:
    case OPERINPUT_DELETE_WE_FAILURE:
    case OPERINPUT_FETCH_WE_FAILURE:
      return {
        ...state,
        info: {message: action.payload.errormsg, type: "error"},
        isLoading: false
      }

    case OPERINPUT_ITEMS_SEARCH_FAILURE:
      return {
        ...state,
        foundItems: [],
        searchInfo: {message: action.payload.msg, type: action.payload.type},
        isLoading: false
      }

    case OPERINPUT_WE_CLEAR:
      return {
        ...state,
        weItems: []
      }

    case OPERINPUT_CLEAR:
      return {
        ...state,
        items: []
      }

    case OPERINPUT_INFO_REMOVE:
      return {
        ...state,
        info: null
      }

    case OPERINPUT_SEARCH_INFO_REMOVE:
      return {
        ...state,
        searchInfo: null
      }

    

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
