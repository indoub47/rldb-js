import React from "react";
import PropTypes from "prop-types";
import {liko} from "./functions";

const ItemRow = ({ item, editItem, deleteItem }) => {
  return (
    <tr>
      <td className="region">{item.region}</td>
      <td className="meistrija">{item.meistrija}</td>
      <td className="id text-right">{item.id}</td>
      <td className="id1 text-right">{item.id1}</td>
      <td className="linija">{item.linija}</td>
      <td className="kelias">{item.kelias}</td>
      <td className="km text-right">{item.km}</td>
      <td className="pk text-right">{item.pk}</td>
      <td className="m text-right">{item.m}</td>
      <td className="siule">{item.siule}</td>
      <td className="kodas">{item.kodas}</td>
      <td className="dl text-right">{item.dl}</td>
      <td className="dh text-right">{item.dh}</td>
      <td className="pavoj">{item.pavoj}</td>
      <td className="kkateg">{item.kkateg}</td>
      <td className="btipas">{item.btipas}</td>
      <td className="bgamykla">{item.bgamykla}</td>
      <td className="bmetai">{item.bmetai}</td>
      <td className="oper">{item.oper}</td>
      <td className="apar">{item.apar}</td>
      <td className="daptik">{item.daptik}</td>
      <td className="dtermin">{item.dtermin}</td>
      <td className="dtvarsl">{item.dtvarsl}</td>
      <td className="panaikinta">{item.panaikinta}</td>
      <td className="liko">{liko(item)}</td>
      <td className="pastaba">{item.pastaba}</td>
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
      <th className="meistrija">meistrija</th>
      <th className="id">id</th>
      <th className="id1">id1</th>
      <th className="linija">linija</th>
      <th className="kelias">kelias</th>
      <th className="km">km</th>
      <th className="pk">pk</th>
      <th className="m">m</th>
      <th className="siule">siule</th>
      <th className="kodas">kodas</th>
      <th className="dl">dl</th>
      <th className="dh">dh</th>
      <th className="pavoj">pavoj</th>
      <th className="kkateg">kkateg</th>
      <th className="btipas">btipas</th>
      <th className="bgamykla">bgamykla</th>
      <th className="bmetai">bmetai</th>
      <th className="oper">oper</th>
      <th className="apar">apar</th>
      <th className="daptik">daptik</th>
      <th className="dtermin">dtermin</th>
      <th className="dtvarsl">dtvarsl</th>
      <th className="panaikinta">panaikinta</th>
      <th className="liko">liko</th>
      <th className="pastaba">pastaba</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { ItemRow, ItemHeadRow };
