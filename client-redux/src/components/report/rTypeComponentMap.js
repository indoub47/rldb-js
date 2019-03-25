import ActiveDefectsTable from './activeDefects/ActiveDefectsTable';
import ActiveDefectsParamsCollector from './activeDefects/ActiveDefectsParamsCollector';
import ActiveDefectsCountTable from './activeDefects/ActiveDefectsCountTable';

import * as rtypes from '../../reportTypes';

const rTypeComponentMap = {
  [rtypes.defectsUndone]: {
    title: "Keliuose esantys defektai.",
    subtitle: "Tik pradelsti arba visi",
    paramsCollector: ActiveDefectsParamsCollector,
    reportTable: ActiveDefectsTable
  },
  [rtypes.defectsUndoneCount]: {
    title: "Keliuose esančių defektų skaičiai.",
    subtitle: "Tik pradelstų arba visų",
    paramsCollector: ActiveDefectsParamsCollector,
    reportTable: ActiveDefectsCountTable
  },
};

export default rTypeComponentMap;