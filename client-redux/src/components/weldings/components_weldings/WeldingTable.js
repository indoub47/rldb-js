import React from "react";
import PropTypes from "prop-types";
import { WeldingHeadRow, WeldingRow } from "./WeldingRow";

const WeldingTable = ({ items, editWelding, deleteWelding }) => {
  if (items.length < 1) {
    return (
      <div className="alert alert-info">There's no weldings for this view.</div>
    );
  }

  const weldingRows = items.map(welding => (
    <WeldingRow
      welding={welding}
      editWelding={editWelding}
      deleteWelding={deleteWelding}
      key={welding.id}
    />
  ));

  // console.log("WeldingTable items", items);
  // console.log("WeldingTable weldingRows", weldingRows);

  return (
    <table
      className="table table-sm table-striped table-bordered weldings"
      style={{ fontSize: ".95rem" }}
    >
      <thead>
        <WeldingHeadRow />
      </thead>
      <tbody>{weldingRows}</tbody>
    </table>
  );
};

WeldingTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editWelding: PropTypes.func.isRequired,
  deleteWelding: PropTypes.func.isRequired
};

export default WeldingTable;
