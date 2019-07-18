import React from "react";

const InputRow = ({ inputItem, setItemEdit, deleteItem, copyItem, isCurrent }) => {
  return (
    <tr className={isCurrent ? "current" : undefined}>
      <td className="id">{inputItem.id}</td>
      <td className="meistrija vieta">{inputItem.meistrija}</td>
      <td className="linija vieta">{inputItem.linija}</td>
      <td className="kelias vieta">{inputItem.kelias}</td>
      <td className="km text-right vieta">{inputItem.km}</td>
      <td className="pk text-right vieta">{inputItem.pk}</td>
      <td className="m text-right vieta">{inputItem.m}</td>
      <td className="siule vieta">{inputItem.siule}</td>
      <td className="btipas begis">{inputItem.btipas}</td>
      <td className="bgamykl begis">{inputItem.bgamykl}</td>
      <td className="bmetai begis">{inputItem.bmetai}</td>
      <td className="oper">{inputItem.oper}</td>
      <td className="apar">{inputItem.apar}</td>
      <td className="data">{inputItem.data}</td>
      <td className="kodas def">{inputItem.kodas}</td>
      <td className="dl text-right def">{inputItem.dl}</td>
      <td className="dh text-right def">{inputItem.dh}</td>
      <td className="kkateg">{inputItem.kkateg}</td>
      <td className="pavoj def">{inputItem.pavoj}</td>
      <td className="dtermin def">{inputItem.dtermin}</td>
      <td className="note">{inputItem.note}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={inputItem.id}
            onClick={setItemEdit}
          >
            <i className="fas fa-edit" data-id={inputItem.id} />
          </button>
          <button
            className="btn btn-xs btn-info"
            data-id={inputItem.id}
            onClick={copyItem}
          >
            <i className="fas fa-copy" data-id={inputItem.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={inputItem.id}
            onClick={deleteItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-id={inputItem.id}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

const InputHeadRow = () => {
  return (
    <tr>
      <th className="id">ID</th>
      <th className="meistrija vieta">Meistrija</th>
      <th className="linija vieta">Linija</th>
      <th className="kelias vieta">Kelias</th>
      <th className="km vieta">Km</th>
      <th className="pk vieta">Pk</th>
      <th className="m vieta">M</th>
      <th className="siule vieta">Siūlė</th>
      <th className="btipas begis">BTipas</th>
      <th className="bgamykl begis">BGamykl</th>
      <th className="bmetai begis">BMetai</th>
      <th className="oper">Oper</th>
      <th className="apar">Apar</th>
      <th className="data">Data</th>
      <th className="kodas def">DKodas</th>
      <th className="dl def">L</th>
      <th className="dh def">H</th>
      <th className="kkateg def">KKateg</th>
      <th className="pavoj def">Pavoj</th>
      <th className="dtermin def">Terminas</th>
      <th className="note">Pastaba</th>
      <th className="controls">Controls</th>
    </tr>
  );
};

export { InputRow, InputHeadRow };
