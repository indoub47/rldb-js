import React from "react";
import PropTypes from "prop-types";

const WeldingRow = ({ welding, editWelding, deleteWelding }) => {
  return (
    <tr>
      <td className="id text-right">{welding.id}</td>
      <td className="region">{welding.region}</td>
      <td className="linija">{welding.linija}</td>
      <td className="kelias">{welding.kelias}</td>
      <td className="km text-right">{welding.km}</td>
      <td className="pk text-right">{welding.pk}</td>
      <td className="m text-right">{welding.m}</td>
      <td className="siule">{welding.siule}</td>
      <td className="virino">{welding.virino}</td>
      <td className="vbudas">{welding.vbudas}</td>
      <td className="data" nowrap="nowrap">{welding.data1}</td>
      <td className="apar">{welding.apar1}</td>
      <td className="oper">{welding.oper1}</td>
      <td className="data" nowrap="nowrap">{welding.data2}</td>
      <td className="apar">{welding.apar2}</td>
      <td className="oper">{welding.oper2}</td>
      <td className="data" nowrap="nowrap">{welding.data3}</td>
      <td className="apar">{welding.apar3}</td>
      <td className="oper">{welding.oper3}</td>
      <td className="data" nowrap="nowrap">{welding.data4}</td>
      <td className="apar">{welding.apar4}</td>
      <td className="oper">{welding.oper4}</td>
      <td className="panaikinta">{welding.panaikinta}</td>
      <td className="defectid">{welding.defectid}</td>
      <td className="pastaba">{welding.pastaba}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={welding.id}
            onClick={editWelding}
          >
            <i className="fas fa-edit" data-id={welding.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={welding.id}
            onClick={deleteWelding}
          >
            <i className="fas fa-trash-alt" data-id={welding.id} />
          </button>
        </div>
      </td>
    </tr>
  );
};

WeldingRow.propTypes = {
  welding: PropTypes.object.isRequired,
  editWelding: PropTypes.func,
  deleteWelding: PropTypes.func
};

const WeldingHeadRow = () => {
  return (
    <tr>
      <th className="id text-right">id</th>
      <th className="region">region</th>
      <th className="linija">linija</th>
      <th className="kelias">kelias</th>
      <th className="km text-right">km</th>
      <th className="pk text-right">pk</th>
      <th className="m text-right">m</th>
      <th className="siule">siule</th>
      <th className="virino">virino</th>
      <th className="vbudas">vbudas</th>
      <th className="data" nowrap="nowrap">data1</th>
      <th className="apar">apar1</th>
      <th className="oper">oper1</th>
      <th className="data" nowrap="nowrap">data2</th>
      <th className="apar">apar2</th>
      <th className="oper">oper2</th>
      <th className="data" nowrap="nowrap">data3</th>
      <th className="apar">apar3</th>
      <th className="oper">oper3</th>
      <th className="data" nowrap="nowrap">data4</th>
      <th className="apar">apar4</th>
      <th className="oper">oper4</th>
      <th className="panaikinta">panaikinta</th>
      <th className="defectid">defectid</th>
      <th className="pastaba">pastaba</th>
    </tr>
  );
};

export { WeldingRow, WeldingHeadRow };
