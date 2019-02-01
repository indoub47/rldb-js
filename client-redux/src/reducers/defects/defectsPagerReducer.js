import {
  DEFECTS_PAGE_CHANGE,
  DEFECTS_PER_PAGE_CHANGE,
  DEFECTS_FILTERSORT_APPLIED,
  DEFECTS_REFRESH,
  LOGOUT
} from "../../actions/types";
//import getPagerObj from '../actions/functions/getPagerObj';
import {pagerSettings} from '../../components/common/pager/settings';


const initialState = {
  itemsPerPage: 0,
  currPageIndex: 0,
  firstItemIndex: 0,
  buttons: [],
};

export default function defectsPagerReducer(state = initialState, action) {
  var pagerObj;
  switch (action.type) {

    case DEFECTS_PAGE_CHANGE:
      if (action.payload.pageIndex === state.currPageIndex) {
        // tas neturėtų įvykti, nes knopkė su currentPage yra neaktyvi
        return state;
      }
      pagerObj = getPagerObj(
        state.itemsPerPage, 
        action.payload.itemCount,
        action.payload.pageIndex);
      return pagerObj;


    case DEFECTS_PER_PAGE_CHANGE:
      if (action.payload.itemsPerPage === state.itemsPerPage) {
        return state;
      }
      pagerObj = getPagerObj(
        action.payload.itemsPerPage, 
        action.payload.itemCount, 
        0);
      return pagerObj;

    case DEFECTS_FILTERSORT_APPLIED: 
      pagerObj = getPagerObj(10, action.payload.items.length, 0);
      return pagerObj;

    case DEFECTS_REFRESH:
    case LOGOUT: 
      return initialState;

    default:
      return state;
  }
}

const getPagerObj = (itemsPerPage, itemCount, currPageIndex) => {
  const firstItemIndex = currPageIndex * itemsPerPage;
  const halfOfVisible = Math.floor(pagerSettings.showPageCount / 2);
  const pageCount = Math.ceil(itemCount / itemsPerPage);
  const lastPageIndex = pageCount - 1;
  const pagesRight = pageCount - currPageIndex - 1;
  const pagesLeft = currPageIndex;
  let buttons = [];

  // add current
  buttons.push({
    pageIndex: currPageIndex,
    label: currPageIndex + 1,
    role: "current"
  });

  // add visible left
  let i = 1;
  while (i <= halfOfVisible && currPageIndex - i > 0) {
    buttons.unshift({
      pageIndex: currPageIndex - i,
      label: currPageIndex - i + 1,
      role: "visible-left"
    });
    i++;
  }

  // add visible right
  i = 1;
  while (i <= halfOfVisible && currPageIndex + i < lastPageIndex) {
    buttons.push({
      pageIndex: currPageIndex + i,
      label: currPageIndex + i + 1,
      role: "visible-right"
    });
    i++;
  }

  if (buttons[0].pageIndex > 1) {
    buttons.unshift({
      pageIndex: -1,
      label: "...",
      role: "ellipsis-left"
    });

    // count the highest base of navigation
    let maxShifBase = 0;
    while (Math.pow(pagerSettings.navBase, maxShifBase) <= pagesLeft) {
      maxShifBase++;
    }

    for (i = 0; i < maxShifBase; i++) {
      const shiftedPageIndex = currPageIndex - Math.pow(pagerSettings.navBase, i);
      buttons.unshift({
        pageIndex: shiftedPageIndex,
        label: Array(i + 2).join("<"),
        role: "shift-back"
      });
    }
  }

  if (currPageIndex > 0) {
    buttons.unshift({
      pageIndex: 0,
      label: 1,
      role: "first-page"
    });
  }

  const lastindex = buttons[buttons.length - 1].pageIndex;

  if (lastindex < lastPageIndex - 1) {
    buttons.push({
      pageIndex: -1,
      label: "...",
      role: "ellipsis-right"
    });

    // count the highest base of navigation
    let maxShifBase = 0;
    while (Math.pow(pagerSettings.navBase, maxShifBase) <= pagesRight) {
      maxShifBase++;
    }

    for (i = 0; i < maxShifBase; i++) {
      const shiftedPageIndex = currPageIndex + Math.pow(pagerSettings.navBase, i);
      buttons.push({
        pageIndex: shiftedPageIndex,
        label: Array(i + 2).join(">"),
        role: "shift-forward"
      });
    }
  }

  if (currPageIndex < lastPageIndex) {
    buttons.push({
      pageIndex: lastPageIndex,
      label: lastPageIndex + 1,
      role: "last-page"
    });
  }

  return {
    itemsPerPage,
    currPageIndex,
    firstItemIndex,
    buttons,
  };
}
