import {
  getFilterFunction,
  getSortFunction
} from "./functions/filterSortRoutines";
import {
  filterReplacements,
  getSortingReplacement
} from "./replacements/weldingFnReplacements";

export const filterFuncCreator = filterString => {
  return getFilterFunction(filterString, filterReplacements);
};

export const sortFuncCreator = sortString => {
  return getSortFunction(sortString, getSortingReplacement);
};
