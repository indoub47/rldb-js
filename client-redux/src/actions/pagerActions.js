import { PAGE_CHANGE, ITEMS_PER_PAGE_CHANGE } from "./types";

export const pageChange = (pageIndex, itemCount) => (dispatch) =>
  dispatch({
    type: PAGE_CHANGE,
    payload: {itemCount, pageIndex}
  });

export const itemsPerPageChange = (itemsPerPage, itemCount) => (dispatch) =>
  dispatch({
    type: ITEMS_PER_PAGE_CHANGE,
    payload: {itemCount, itemsPerPage}
  });
