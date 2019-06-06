const defectMain = require("./defect/main");
const defectJournal = require("./defect/journal");
const loginModel = require("./login");
const weldingMain = require("./welding/main");
const weldingJournal = require("./welding/journal");

module.exports = {
  defect: {journal: defectJournal, main: defectMain},
  login: loginModel,
  welding: {journal: weldingJournal, main: weldingMain},
}