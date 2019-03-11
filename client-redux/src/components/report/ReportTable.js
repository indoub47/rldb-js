import React from 'react';
import SingleRow from './SingleRow';
import HeaderRow from './HeaderRow';

const ReportTable = ({report}) => {

  const rows = report.rows.map((row, index) => 
    <SingleRow
      row={row} 
      key={row.index}
    />
  );

  return (      
    <table 
      className="table table-sm table-striped table-bordered report" style={{fontSize: ".9rem"}}
    >
      <thead>
        <HeaderRow header={report.header} />
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default ReportTable;