import * as defectReplacements from "./actions/functions/filterSort/replacements/defect";
import * as weldingReplacements from "./actions/functions/filterSort/replacements/welding";

import * as defectMainDataForm from "./components/items/specific/defects/MainDataForm";
import * as weldingMainDataForm from "./components/items/specific/weldings/MainDataForm";

import * as defectSingleRow from "./components/items/specific/defects/SingleRow";
import * as weldingSingleRow from "./components/items/specific/weldings/SingleRow";
import * as iTypes from "./itypes"


export default function itemSpecific(itype) {
  switch(itype){
    case iTypes.defect:
      return {
        replacements: defectReplacements,
        mainDataForm: defectMainDataForm,
        singleRow: defectSingleRow
      };
    case iTypes.welding:
      return {
        replacements: weldingReplacements,
        mainDataForm: weldingMainDataForm,
        singleRow: weldingSingleRow
      };
    default: // do nothing so far
  }
}