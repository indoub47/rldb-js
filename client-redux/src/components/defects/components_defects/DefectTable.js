import React from 'react';
import PropTypes from 'prop-types';
import {DefectHeadRow, DefectRow} from './DefectRow';

const DefectTable = ({items, editDefect, deleteDefect}) => {

  if (items.length < 1) {
    return (
      <div className="alert alert-info">
        There's no defects for this view.
      </div>
    );
  }
  
  const defectRows = items.map(
    defect => 
      <DefectRow 
        defect={defect}
        editDefect={editDefect}
        deleteDefect={deleteDefect}
        key={defect.id}
      />
  );

  // console.log("DefectTable items", items);
  // console.log("DefectTable defectRows", defectRows);

  return (      
    <table 
      className="table table-sm table-striped table-bordered defects" style={{fontSize: ".95rem"}}
    >
      <thead>
        <DefectHeadRow />
      </thead>
      <tbody>
        {defectRows}
      </tbody>
    </table>

  );
}

DefectTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editDefect: PropTypes.func.isRequired,
  deleteDefect: PropTypes.func.isRequired
};

export default DefectTable;