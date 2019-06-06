import React from "react";

const JournalRow = ({ jItem, editJItem, deleteJItem }) => {
  return (
    <tr>
      <td className="hdata">{jItem.hdata}</td>
      <td className="oper">{jItem.oper}</td>
      <td className="apar">{jItem.apar}</td>
      <td className="kodas">{jItem.kodas}</td>
      <td className="dl text-right">{jItem.dl}</td>
      <td className="dh text-right">{jItem.dh}</td>
      <td className="pavoj">{jItem.pavoj}</td>
      <td className="termin">{jItem.termin}</td>
      <th className="action">{jItem.action}</th>
      <td className="note">{jItem.note}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={jItem.id}
            onClick={editJItem}
          >
            <i className="fas fa-edit" hitemid={jItem.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={jItem.id}
            data-v={jItem.v}
            onClick={deleteJItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-id={jItem.id}
              data-v={jItem.v}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

const JournalHeadRow = () => {
  return (
    <tr>
      <th className="hdata">hdata</th>
      <th className="oper">oper</th>
      <th className="apar">apar</th>
      <th className="kodas">kodas</th>
      <th className="dl">dl</th>
      <th className="dh">dh</th>
      <th className="pavoj">pavoj</th>
      <th className="termin">termin</th>
      <th className="action">action</th>
      <th className="note">note</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { JournalRow, JournalHeadRow };
