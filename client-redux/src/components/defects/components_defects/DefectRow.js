import React from "react";
import PropTypes from "prop-types";
const DefectRow = ({defect, editDefect, deleteDefect}) => {
  const lastStory = defect.history[defect.history.length - 1];
  const liko = strTermin => Math.floor((Date.now() - Date.parse(strTermin)) / 86400000);
  return (
    <tr>
      <td className="id text-right">{defect.id}</td>
      <td className="meistrij">{defect.vieta.meistrij}</td>
      <td className="linst">{defect.vieta.linst}</td>
      <td className="kel">{defect.vieta.kel}</td>
      <td className="iesm">{defect.vieta.iesm}</td>
      <td className="km text-right">{defect.vieta.km}</td>
      <td className="pk text-right">{defect.vieta.pk}</td>
      <td className="m text-right">{defect.vieta.m}</td>
      <td className="siule">{defect.vieta.siule}</td>
      <td className="oper">{lastStory.oper}</td>
      <td className="apar">{lastStory.apar}</td>
      <td className="data">{lastStory.data}</td>
      <td className="kodas">{lastStory.kodas}</td>
      <td className="pavoj">{lastStory.pavoj}</td>
      <td className="termin" nowrap="nowrap">
        {lastStory.termin}
      </td>
      <td className="liko">
        {lastStory.termin && !lastStory.panaik ? liko(lastStory.termin) : ""}
      </td>
      <td className="dl text-right">{lastStory.dl}</td>
      <td className="dh text-right">{lastStory.dh}</td>
      <td className="kkateg">{defect.kkateg}</td>
      <td className="btipas">{defect.begis.tipas}</td>
      <td className="rdata" nowrap="nowrap">
        {defect.history[0].data}
      </td>
      <td className="panaik">
        {lastStory.panaik ? lastStory.panaik : lastStory.tvarsl ? "T" : ""}
      </td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={defect.id}
            onClick={editDefect}
          >
            <i className="fas fa-edit"
            data-id={defect.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={defect.id}
            onClick={deleteDefect}
          >
            <i className="fas fa-trash-alt"
            data-id={defect.id} />
          </button>
        </div>
      </td>
    </tr>
  );
};

DefectRow.propTypes = {
  defect: PropTypes.object.isRequired,
  editDefect: PropTypes.func,
  deleteDefect: PropTypes.func
};

const DefectHeadRow = () => {
  return (
    <tr>
      <th className="id">id</th>
      <th className="meistrij">meistrij</th>
      <th className="linst">linst</th>
      <th className="kel">kel</th>
      <th className="iesm">iesm</th>
      <th className="km">km</th>
      <th className="pk">pk</th>
      <th className="m">m</th>
      <th className="siule">siule</th>
      <th className="oper">oper</th>
      <th className="apar">apar</th>
      <th className="data">data</th>
      <th className="kodas">kodas</th>
      <th className="pavoj">pavoj</th>
      <th className="termin">termin</th>
      <th className="liko">liko</th>
      <th className="dl">dl</th>
      <th className="dh">dh</th>
      <th className="kkateg">kkateg</th>
      <th className="btipas">btipas</th>
      <th className="rdata">rdata</th>
      <th className="panaik">panaik</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export {DefectRow, DefectHeadRow};
