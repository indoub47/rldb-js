import React from 'react';
import PropTypes from 'prop-types';
import {ItemRow, ItemHeadRow} from "./WeldingRow";
const ItemTable = ({items, editItem, deleteItem}) => {

  if (items.length < 1) {
    return (
      <div className="alert alert-info">
        There's no defects for this view.
      </div>
    );
  }
  
  const itemRows = items.map(
    item =>
      <ItemRow 
        item={item}
        editItem={editItem}
        deleteItem={deleteItem}
        key={item.id}
      />
  );

  return (      
    <table 
      className="table table-sm table-striped table-bordered defects" style={{fontSize: ".95rem"}}
    >
      <thead>
        <ItemHeadRow />
      </thead>
      <tbody>
        {itemRows}
      </tbody>
    </table>

  );
}

ItemTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
};

export default ItemTable;