import React from "react";
import PropTypes from "prop-types";

const ItemTable = ({ items, editItem, deleteItem, ItemRow, ItemHeadRow }) => {
  if (items.length < 1) {
    return (
      <div className="alert alert-info">There's no items for this view.</div>
    );
  }

  const itemRows = items.map(item => (
    <ItemRow // dinamiškai
      item={item}
      editItem={editItem}
      deleteItem={deleteItem}
      key={item.id}
    />
  ));

  return (
    <table
      className="table table-sm table-striped table-bordered defects"
      style={{ fontSize: ".95rem" }}
    >
      <thead>
        <ItemHeadRow />
      </thead>
      <tbody>{itemRows}</tbody>
    </table>
  );
};

ItemTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editItems: PropTypes.func,
  deleteItems: PropTypes.func
};

export default ItemTable;
