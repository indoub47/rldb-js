import { combineReducers } from "redux";
import thingsReducer from "./thingsReducer";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
import queriesReducer from "./queriesReducer";

import allDefectsReducer from "./defects/allDefectsReducer";
import defectsFSReducer from "./defects/defectsFSReducer";
import defectsPagerReducer from "./defects/defectsPagerReducer";
import defectsShowReducer from "./defects/defectsShowReducer";
import defectsStatusReducer from "./defects/defectsStatusReducer";
import fsedDefectsReducer from "./defects/fsedDefectsReducer";

import allWeldingsReducer from "./weldings/allWeldingsReducer";
import weldingsFSReducer from "./weldings/weldingsFSReducer";
import weldingsPagerReducer from "./weldings/weldingsPagerReducer";
import weldingsShowReducer from "./weldings/weldingsShowReducer";
import weldingsStatusReducer from "./weldings/weldingsStatusReducer";
import fsedWeldingsReducer from "./weldings/fsedWeldingsReducer";


export default combineReducers({
  login: loginReducer,
  things: thingsReducer,
  register: registerReducer,
  queries: queriesReducer,

  allDefects: allDefectsReducer,
  defectsFS: defectsFSReducer,
  defectsPager: defectsPagerReducer,
  defectsShow: defectsShowReducer,
  defectsStatus: defectsStatusReducer,
  fsedDefects: fsedDefectsReducer,

  allWeldings: allWeldingsReducer,
  weldingsFS: weldingsFSReducer,
  weldingsPager: weldingsPagerReducer,
  weldingsShow: weldingsShowReducer,
  weldingsStatus: weldingsStatusReducer,
  fsedWeldings: fsedWeldingsReducer
});
