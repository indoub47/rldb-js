import React from 'react';
import PropTypes from 'prop-types';

const ItemTable = ({items, editItem, deleteItem, itemHeadRow, itemRow}) => {

  if (items.length < 1) {
    return (
      <div className="alert alert-info">
        There's no defects for this view.
      </div>
    );
  }
  
  const itemRows = items.map(
    item => 
    // kaip daryti šitoje vietoje?
    // ItemRow pareina kaip prop itemRow iš Weldings:
    
                // itemRow={<ItemRow />}
                // itemHeadRow={<ItemHeadRow />}

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
        {itemHeadRow}
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