import { combineReducers } from "redux";
import thingsReducer from "./thingsReducer";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
import pagerReducer from "./pagerReducer";
import filterSortReducer from "./filterSortReducer";
import queriesReducer from "./queriesReducer";
import allDefectsReducer from "./defects/allDefectsReducer";
import fsedDefectsReducer from "./defects/fsedDefectsReducer";
import defectsStatusReducer from "./defects/defectsStatusReducer";
import allWeldingsReducer from "./weldings/allWeldingsReducer";
import fsedWeldingsReducer from "./weldings/fsedWeldingsReducer";
import weldingsStatusReducer from "./weldings/weldingStatusReducer";
import showReducer from "./showReducer";

export default combineReducers({
  login: loginReducer,
  things: thingsReducer,
  register: registerReducer,
  filterSort: filterSortReducer,
  allDefects: allDefectsReducer,
  fsedDefects: fsedDefectsReducer,
  defectsStatus: defectsStatusReducer,
  allWeldings: allWeldingsReducer,
  fsedWeldings: fsedWeldingsReducer,
  weldingsStatus: weldingsStatusReducer,
  queries: queriesReducer,
  pager: pagerReducer,
  show: showReducer
});
