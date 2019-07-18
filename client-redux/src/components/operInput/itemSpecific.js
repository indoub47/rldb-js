import * as defectApproveRow from "./specific/defects/ApproveRow";
import * as defectInputForm from "./specific/defects/InputForm";
import * as defectInputRow from "./specific/defects/InputRow";
import * as defectSearchForm from "./specific/defects/SearchForm";
import * as defectSearchResultRow from "./specific/defects/SearchResultRow";
import defectFieldsToClear from "./specific/defects/fieldsToClear"; 
import * as iTypes from "../../itypes";


export default {
  [iTypes.defect]: {
        approveRow: defectApproveRow,
        inputForm: defectInputForm,
        inputRow: defectInputRow,
        searchForm: defectSearchForm,
        searchResultRow: defectSearchResultRow,
        fieldsToClear: defectFieldsToClear
      }
};