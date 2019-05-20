import * as defectReplacements from "./actions/functions/filterSort/replacements/defect";
import * as weldingReplacements from "./actions/functions/filterSort/replacements/welding";
import * as employeeReplacements from "./actions/functions/filterSort/replacements/employee";

import * as defectMainDataForm from "./components/items/specific/defects/MainDataForm";
import * as weldingMainDataForm from "./components/items/specific/weldings/MainDataForm";
import * as employeeMainDataForm from "./components/items/specific/employees/MainDataForm";

import * as defectSingleRow from "./components/items/specific/defects/SingleRow";
import * as weldingSingleRow from "./components/items/specific/weldings/SingleRow";
import * as employeeSingleRow from "./components/items/specific/employees/SingleRow";
import * as iTypes from "./itypes"


export default function itemSpecific(itype) {
  switch(itype){
    case iTypes.defect:
      return {
        replacements: defectReplacements,
        mainDataForm: defectMainDataForm.MainDataForm,
        singleRow: defectSingleRow,
        listPath: "/defects",
        panaikinta: item => !!item.daction
      };
    case iTypes.welding:
      return {
        replacements: weldingReplacements,
        mainDataForm: weldingMainDataForm.MainDataForm,
        singleRow: weldingSingleRow,
        listPath: "/weldings",
        panaikinta: item => {throw "panaikinta for welding is not implemented"}
      };
    case iTypes.employee:
      return {
        replacements: employeeReplacements,
        mainDataForm: employeeMainDataForm.MainDataForm,
        singleRow: employeeSingleRow,
        listPath: "/employees",
        panaikinta: item => {throw "panaikinta for employee is not implemented"}
      };
    default: // do nothing so far
  }
}