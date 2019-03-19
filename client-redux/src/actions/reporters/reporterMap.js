import * as rtypes from "../../reportTypes";
import {UDDataTransformer} from "./defectsUndone/UDDataTransformer";
import {UDDataNumberTransformer} from "./defectsUndone/UDDataNumberTransformer";
import {UDLocalDataManager} from "./defectsUndone/UDLocalDataManager";

const reporterMap = {
  [rtypes.defectsUndone]: {
     apiUrl: "/api/report/defects-undone",
     localDataManager: new UDLocalDataManager(),
     DataTransformerClass: UDDataTransformer
  },
  [rtypes.defectsUndoneCount]: {
     apiUrl: "/api/report/defects-undone-count",
     localDataManager: new UDLocalDataManager(),
     DataTransformerClass: UDDataNumberTransformer
  }
}

export default reporterMap;