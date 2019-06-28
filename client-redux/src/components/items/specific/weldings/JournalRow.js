import React from "react";

const JournalRow = ({ jItem, setForEdit, deleteJItem, current }) => {
  return (
    <tr className={current ? "current" : undefined}>
      <td className="id">{jItem.id}</td>
      <td className="dt">{jItem.dt}</td>
      <td className="oper">{jItem.oper}</td>
      <td className="apar">{jItem.apar}</td>
      <td className="pvd">{jItem.pvd}</td>
      <td className="note">{jItem.note}</td>
      <td className="defectid">{jItem.defectid}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={jItem.id}
            onClick={setForEdit}
          >
            <i className="fas fa-edit" data-id={jItem.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={jItem.id}
            onClick={deleteJItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-id={jItem.id}
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
      <th className="id">id</th>
      <th className="dt">data</th>
      <th className="oper">oper</th>
      <th className="apar">apar</th>
      <th className="pvd">pavadinimas</th>
      <th className="note">pastaba</th>
      <th className="id">defekto id</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { JournalRow, JournalHeadRow };
