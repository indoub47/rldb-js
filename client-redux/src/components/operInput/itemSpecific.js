import * as defectApproveRow from "./specific/defects/ApproveRow";
import * as defectForm from "./specific/defects/EditForm";
import * as defectInputRow from "./specific/defects/InputRow";
import * as defectSearchForm from "./specific/defects/SearchForm";
import * as defectSearchResultRow from "./specific/defects/SearchResultRow";
import defectOptions from "./specific/defects/options"; 
import * as iTypes from "../../itypes";
import * as defectModel from "./specific/defects/model";


export default {
  [iTypes.defect]: {
        approveRow: defectApproveRow,
        inputForm: defectForm,
        iApproveEditForm: defectForm,
        inputRow: defectInputRow,
        searchForm: defectSearchForm,
        searchResultRow: defectSearchResultRow,
        model: defectModel,
        options: defectOptions
      }
};