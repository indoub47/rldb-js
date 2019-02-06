import React from 'react';
import PropTypes from 'prop-types';
import itemSpecific from "../../itemSpecific";

const ItemTable = ({items, editItem, deleteItem, itype}) => {

  if (items.length < 1) {
    return (
      <div className="alert alert-info">
        There's no defects for this view.
      </div>
    );
  }

  const singleRow = itemSpecific(itype).singleRow;
  
  const itemRows = items.map(item => 
    singleRow.ItemRow({item, editItem, deleteItem, key: item.id})
  );

  return (      
    <table 
      className="table table-sm table-striped table-bordered defects" style={{fontSize: ".95rem"}}
    >
      <thead>
        {singleRow.ItemHeadRow()}
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