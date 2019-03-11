import React from 'react';

const SingleRow = ({row}) => {  
  const SingleCell = ({value}) => (<td>{value}</td>);
  let cells = null;
  if (typeof row === 'object') {
    if (Array.isArray(row)) {
      cells = row.map((c, ind) => <SingleCell key={ind} value={c} />);
    } else {
      cells = [];
      Object.keys(row).forEach((k, ind) => 
        cells.push(<SingleCell key={ind} value={row[k]} />);
      );
    }
  }
  
  return (
    <tr>
      {cells}
    </tr>
  );
}

export default SingleRow;