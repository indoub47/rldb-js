import ActiveDefectsTable from './activeDefects/ActiveDefectsTable';
import ActiveDefectsParamsCollector from './activeDefects/ActiveDefectsParamsCollector';
import ActiveDefectsCountTable from './activeDefects/ActiveDefectsCountTable';

import * as rtypes from '../../reportTypes';

const rTypeComponentMap = {
  [rtypes.defectsUndone]: {
    paramsCollector: ActiveDefectsParamsCollector,
    reportTable: ActiveDefectsTable
  },
  [rtypes.defectsUndoneCount]: {
    paramsCollector: ActiveDefectsParamsCollector,
    reportTable: ActiveDefectsCountTable
  },
};

export default rTypeComponentMap;