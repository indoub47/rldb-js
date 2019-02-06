import { combineReducers } from "redux";
import thingsReducer from "./thingsReducer";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
import queriesReducer from "./queriesReducer";

import allItemsReducer from "./items/allItemsReducer";
import itemsFSReducer from "./items/itemsFSReducer";
import itemsPagerReducer from "./items/itemsPagerReducer";
import itemsShowReducer from "./items/itemsShowReducer";
import itemsStatusReducer from "./items/itemsStatusReducer";
import fsedItemsReducer from "./items/fsedItemsReducer";


export default combineReducers({
  login: loginReducer,
  things: thingsReducer,
  register: registerReducer,
  queries: queriesReducer,

  allItems: allItemsReducer,
  itemsFS: itemsFSReducer,
  itemsPager: itemsPagerReducer,
  itemsShow: itemsShowReducer,
  itemsStatus: itemsStatusReducer,
  fsedItems: fsedItemsReducer
});
