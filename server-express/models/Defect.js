const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefectSchema = new Schema({
  id: { type: String },
  region: { type: String },
  kkateg: { type: String },
  vieta: {
    meistrij: { type: String },
    linst: { type: String },
    kelias: { type: String },
    iesmas: { type: String },
    km: { type: Number },
    pk: { type: Number },
    m: { type: Number },
    siule: { type: String }
  },
  begis: {
    tipas: { type: String },
    gamykla: { type: String },
    metai: { type: Number },
  },
  history: []
});

module.exports = DefectModel = mongoose.model("defect", DefectSchema);
