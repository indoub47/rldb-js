import {
  FILTERSORT_APPLIED,
  FILTERSORT_APPLY_ERROR
} from "./types";
import {
  filterFuncCreator,
  sortFuncCreator
} from "./functions/filterSort/defectFilterSort";


// apply filter and sort and return result action
export const applyFilterSort = (items, filterText, sortText) => {
  try {    
    const filterFunc = filterFuncCreator(filterText);
    const sortFunc = sortFuncCreator(sortText);
    const fsedItems = items.filter(filterFunc).sort(sortFunc);
    return { 
      type: FILTERSORT_APPLIED, 
      payload: {items: fsedItems, filterText, sortText} 
    };
  } catch (error) {
    return { 
      type: FILTERSORT_APPLY_ERROR, 
      payload: {error} 
    };
  }
};

