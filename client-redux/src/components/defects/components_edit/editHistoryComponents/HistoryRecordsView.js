import React from 'react';
import HistoryRecord from './HistoryRecord';

const HistoryRecordsView = ({defectHistory, remove, setItemForEditing}) => {
 
  const records = defectHistory.map(item => 
      <HistoryRecord 
        key={item.id} 
        hItem={item} 
        remove={remove}
        setForEditing={setItemForEditing}
      />
  );

  return (
    <div className="container-fluid defect-history">
      <div className="row"> 
        <div className="col-12">
          <h4>History</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table table-sm table-striped table-bordered defect-history" style={{fontSize: ".95rem"}}>
            <thead>
              <tr>
                <th className="id">id</th>
                <th className="data">data</th>
                <th className="action">action</th>
                <th className="oper">oper</th>
                <th className="apar">apar</th>
                <th className="dl">dl</th>
                <th className="dh">dh</th>
                <th className="kodas">kodas</th>
                <th className="pavoj">pavoj</th>
                <th className="termin">termin</th>
                <th className="pastaba">pastaba</th>
                <th className="controls">controls</th>
              </tr>
            </thead>
            <tbody>
              {records}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryRecordsView;