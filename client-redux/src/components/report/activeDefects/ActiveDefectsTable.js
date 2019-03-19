import React from "react";

const ActiveDefectsTable = ({ report }) => {
  if (!report) return null;
  
  const THead = ({ report }) => (
    <thead>
      <tr>
        <th scope="col">Meistrija</th>
        <th scope="col">Linija</th>
        <th scope="col">Kelias</th>
        <th scope="col">Km</th>
        <th scope="col">Pk</th>
        <th scope="col">M</th>
        <th scope="col">Siūlė</th>
        <th scope="col">Kodas</th>
        <th scope="col">Pavoj</th>
        <th scope="col">Aptikta</th>
        <th scope="col">Terminas</th>
      </tr>
    </thead>
  );

  const DefectRow = ({ meistrijaLabel, defect }) => {
    return (
      <tr>
        <th scope="row">{meistrijaLabel}</th>
        <td>{defect.linija}</td>
        <td>defect.kelias</td>
        <td>defect.km</td>
        <td>defect.pk</td>
        <td>defect.m</td>
        <td>defect.siule</td>
        <td>defect.skodas</td>
        <td>defect.pavoj</td>
        <td>defect.daptik</td>
        <td>defect.dtermin</td>
      </tr>
    );
  };

  const TBody = ({ report }) => {
    return (
      <tbody>
        {report.map(meistrija =>
          meistrija.map(defect => (
            <DefectRow
              meistrijaLabel={meistrija.label}
              defect={defect}
              key={defect.id}
            />
          ))
        )}
      </tbody>
    );
  };

  return (
    <table className="table">
      <THead report={report} />
      <TBody report={report} />
    </table>
  );
};

export default ActiveDefectsTable;
