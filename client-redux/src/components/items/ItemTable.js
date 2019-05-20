import React from 'react';
import PropTypes from 'prop-types';
import itemSpecific from "../../itemSpecific";

const ItemTable = ({items, editItem, deleteItem, itype}) => {

  if (items.length < 1) {
    return (
      <div className="alert alert-info">
        There's no items for this view.
      </div>
    );
  }

  const singleRow = itemSpecific(itype).singleRow;
  const ItemRow = singleRow.ItemRow;
  
  const itemRows = items.map(item => 
    <ItemRow
      item={item} 
      editItem={editItem}
      deleteItem={deleteItem}
      key={item.id}
    />
  );

  return (      
    <table 
      className="table table-sm table-striped table-bordered items" style={{fontSize: ".9rem"}}
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