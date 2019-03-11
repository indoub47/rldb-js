import React from "react";
import PropTypes from "prop-types";

const ItemRow = ({ item, editItem, deleteItem }) => {
  return (
    <tr>
      <td className="region">{item.region}</td>
      <td className="id text-right">{item.id}</td>
      <td className="name">{item.name}</td>
      <td className="atest">{item.atest}</td>
      <td className="active">{item.active ? "+" : "-"}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={item._id}
            onClick={editItem}
          >
            <i className="fas fa-edit" data-id={item._id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={item._id}
            data-v={item.v}
            onClick={deleteItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-id={item._id}
              data-v={item.v} 
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

ItemRow.propTypes = {
  item: PropTypes.object.isRequired,
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
};

const ItemHeadRow = () => {
  return (
    <tr>
      <th className="region">region</th>
      <th className="id">id</th>
      <th className="name">name</th>
      <th className="atest">atest</th>
      <th className="active">active</th>
    </tr>
  );
};

export { ItemRow, ItemHeadRow };
