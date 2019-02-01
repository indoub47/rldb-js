import React from "react";
import PropTypes from "prop-types";

const ItemRow = ({ item, editItem, deleteItem }) => {
  return (
    <tr>
      <td className="id text-right">{item.id}</td>
      <td className="region">{item.region}</td>
      <td className="linija">{item.linija}</td>
      <td className="kelias">{item.kelias}</td>
      <td className="km text-right">{item.km}</td>
      <td className="pk text-right">{item.pk}</td>
      <td className="m text-right">{item.m}</td>
      <td className="siule">{item.siule}</td>
      <td className="virino">{item.virino}</td>
      <td className="vbudas">{item.vbudas}</td>
      <td className="data" nowrap="nowrap">{item.data1}</td>
      <td className="apar">{item.apar1}</td>
      <td className="oper">{item.oper1}</td>
      <td className="data" nowrap="nowrap">{item.data2}</td>
      <td className="apar">{item.apar2}</td>
      <td className="oper">{item.oper2}</td>
      <td className="data" nowrap="nowrap">{item.data3}</td>
      <td className="apar">{item.apar3}</td>
      <td className="oper">{item.oper3}</td>
      <td className="data" nowrap="nowrap">{item.data4}</td>
      <td className="apar">{item.apar4}</td>
      <td className="oper">{item.oper4}</td>
      <td className="panaikinta">{item.panaikinta}</td>
      <td className="pastaba">{item.pastaba}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={item.id}
            onClick={editItem}
          >
            <i className="fas fa-edit" data-id={item.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={item.id}
            onClick={deleteItem}
          >
            <i className="fas fa-trash-alt" data-id={item.id} />
          </button>
        </div>
      </td>
    </tr>
  );
};

ItemRow.propTypes = {
  item: PropTypes.object.isRequired,
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
};

const ItemHeadRow = () => {
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
      <th className="pastaba">pastaba</th>
    </tr>
  );
};

export { ItemRow, ItemHeadRow };
