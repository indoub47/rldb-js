import * as defectReplacements from "./actions/functions/filterSort/replacements/defect";
import * as weldingReplacements from "./actions/functions/filterSort/replacements/welding";
import * as employeeReplacements from "./actions/functions/filterSort/replacements/employee";

import * as defectMainDataForm from "./components/items/specific/defects/MainDataForm";
import * as weldingMainDataForm from "./components/items/specific/weldings/MainDataForm";
import * as employeeMainDataForm from "./components/items/specific/employees/MainDataForm";

import * as defectSingleRow from "./components/items/specific/defects/SingleRow";
import * as weldingSingleRow from "./components/items/specific/weldings/SingleRow";
import * as employeeSingleRow from "./components/items/specific/employees/SingleRow";

import * as defectJournalEditForm from "./components/items/specific/defects/JournalEditForm";
import * as weldingJournalEditForm from "./components/items/specific/weldings/JournalEditForm";
import * as employeeJournalEditForm from "./components/items/specific/employees/JournalEditForm";

import * as defectJournalRow from "./components/items/specific/defects/JournalRow";
import * as weldingJournalRow from "./components/items/specific/weldings/JournalRow";
import * as employeeJournalRow from "./components/items/specific/employees/JournalRow";
import * as iTypes from "./itypes"


export default {
  [iTypes.defect]: {
        replacements: defectReplacements,
        mainDataForm: defectMainDataForm.MainDataForm,
        singleRow: defectSingleRow,
        journalEditForm: defectJournalEditForm.JournalEditForm,
        journalRow: defectJournalRow.JournalRow,
        journalListHead: defectJournalRow.JournalHeadRow,
        listPath: "/defects",
        panaikinta: item => !!item.dstop
      },
  [iTypes.welding]: {
        replacements: weldingReplacements,
        mainDataForm: weldingMainDataForm.MainDataForm,
        singleRow: weldingSingleRow,
        journalEditForm: weldingJournalEditForm,
        journalRow: weldingJournalRow,
        listPath: "/weldings",
        panaikinta: item => {throw {message: "panaikinta for welding is not implemented"}}
      }
};