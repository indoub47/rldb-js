import React from "react";

export const HeaderRow = () => {
  const availableKkateg = ["1", "2", "3, 4", "kt."];
  const availablePavoj = ["ID", "DP", "D1", "D2", "D3"];
  return (
    <thead>
      <tr>
        <th rowSpan="2">Meistrija</th>
        {availableKkateg.map((kk, ind) => <th key={ind} colSpan={availablePavoj.length}>{kk}</th>);}
      </tr>
      <tr>
        {availableKkateg.map((kk, kind) => availablePavoj.map((p, pind) => <th key={"" + kind + pind}>{p}</th>))}
      </tr>
    </thead>
  );
}

export const TableRow = ({name, row}) => {
  return (
    <tr>
      <td>{name}</td>
      {Object.keys(row).map((kkateg, kind) => Object.keys(kkateg).map((pavoj, pind) => <td>{Object[kkateg][pavoj]}</td>))}
    </tr>
  );
}