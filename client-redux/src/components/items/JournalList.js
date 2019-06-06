import React from 'react';
import itemSpecific from "../../itemSpecific";

const JournalList = ({jItems, setForEdit, deleteJItem, itype}) => {

  if (jItems.length < 1) {
    return (
      <div className="container journal-list text-center">
        <div className="alert alert-info">
          No journal as yet
        </div>
      </div>
    );
  }

  const singleRow = itemSpecific[itype].journalRow;
  const JournalRow = singleRow.ItemRow;
  
  const jItemRows = jItems.map((jItem, ind) => 
    <JournalRow
      jItem={jItem} 
      setForEdit={setForEdit}
      deleteItem={deleteItem}
      key={jItem.id}
    />
  );

  return ( 
    <div className="container journal-list text-center">     
      <table 
        className="table table-sm table-striped table-bordered jitems" style={{fontSize: ".85rem"}}
      >
        <thead>
          {singleRow.JournalHeadRow()}
        </thead>
        <tbody>
          {jItemRows}
        </tbody>
      </table>
    </div>

  );
}

export default JournalList;