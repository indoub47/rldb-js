import React from 'react';

const QueryRow = ({query, remove, setForEditing, moveUp, moveDown}) => {
  const id = query.id;
  return (
    <tr>
      <td className="id">{id}</td>
      <td className="filter">{query.filter}</td>
      <td className="sort">{query.sort}</td>
      <td className="name">{query.name}</td>
      <td nowrap="nowrap">
        <div className="button-group">
          <button className="btn btn-xs btn-warning" data-id={id} onClick={setForEditing}>
            <i data-id={id} className="fas fa-edit"></i>
          </button>
          <button className="btn btn-xs btn-danger" data-id={id} onClick={remove}>
            <i data-id={id} className="fas fa-trash-alt"></i>
          </button>
          <button className="btn btn-xs btn-info" data-id={id} onClick={moveUp}>
            <i data-id={id} className="fas fa-chevron-up"></i>
          </button>
          <button className="btn btn-xs btn-info" data-id={id} onClick={moveDown}>
            <i data-id={id} className="fas fa-chevron-down"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default QueryRow;