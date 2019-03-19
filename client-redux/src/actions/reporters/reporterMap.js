import * as rtypes from "../../reportTypes";
import {UDDataDefectsTransformer} from "./defectsUndone/UDDataDefectsTransformer";
import {UDDataNumberTransformer} from "./defectsUndone/UDDataNumberTransformer";
import {UDLocalDataManager} from "./defectsUndone/UDLocalDataManager";

const reporterMap = {
  [rtypes.defectsUndone]: {
     apiUrl: "/api/report/defects-undone",
     localDataManager: new UDLocalDataManager(),
     DataTransformerClass: UDDataDefectsTransformer
  },
  [rtypes.defectsUndoneCount]: {
     apiUrl: "/api/report/defects-undone-count",
     localDataManager: new UDLocalDataManager(),
     DataTransformerClass: UDDataNumberTransformer
  }
}

export default reporterMap;