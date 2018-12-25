import React from 'react';
import PropTypes from 'prop-types';

const HistoryRecord = ({hItem, remove, setForEditing}) => {
  const id = hItem.id;
  return (
    <tr>
      <td className="id">{id}</td>
      <td className="data" nowrap="nowrap">{hItem.data}</td>
      <td className="action">{hItem.action}</td>
      <td className="oper">{hItem.oper}</td>
      <td className="apar">{hItem.apar}</td>
      <td className="dh">{hItem.dh}</td>
      <td className="dl">{hItem.dl}</td>
      <td className="kodas">{hItem.kodas}</td>
      <td className="pavoj">{hItem.pavoj}</td>
      <td className="termin" nowrap="nowrap">{hItem.termin}</td>
      <td className="pastaba">{hItem.pastaba}</td>
      <td nowrap="nowrap">
        <div className="button-group">
          <button className="btn btn-xs btn-warning" data-id={id} onClick={setForEditing}>
            <i data-id={id} className="fas fa-edit"></i>
          </button>
          <button className="btn btn-xs btn-danger" data-id={id} onClick={remove}>
            <i data-id={id} className="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

HistoryRecord.propTypes = {
  hItem: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  setForEditing: PropTypes.func.isRequired
};

export default HistoryRecord;