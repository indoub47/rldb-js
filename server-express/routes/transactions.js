const SQLStmts = require("./SQLStatements");


module.exports.delete = function (itype, mainData, returnRef, db) {
  const txtDeleteMain = SQLStmts.DELETE_MAIN_stmtText(itype);
  const mainInfo = db.prepare(txtDeleteMain).run(mainData);
  const deleteJournalStmt = SQLStmts.DELETE_WHOLE_JOURNAL_stmt(itype, db);
  const journalInfo = deleteJournalStmt.run(mainData.id);
  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;   
}

module.exports.insert = function (itype, main, journal, returnRef, db) {
  const txtInsertMain = SQLStmts.INSERT_stmtTextFactory(itype, "main")(main);
  const mainInfo = db.prepare(txtInsertMain).run(main);
  if (mainInfo.changes !== 1) throw Error("Error while inserting main");
  const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");
  let journalInfo = [];
  journal.insert.forEach(j => {
    j.mainid = mainInfo.lastInsertRowid;
    const txtInsertJournalItem = factInsertJournal(j);
    const jInfo = db.prepare(txtInsertJournalItem).run(j);
    journalInfo.push(jInfo);
  });
  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;
}

// Adminas parsisiunčia visus operų pateiktus items ir dalį jų approvina, dalį - ne.
// Tada reikia approvintus užkrauti į atitinkamą lentelę, 
// neapprovintus grąžinti operui į unapproved lentelę ir
// ištrinti to itype items'us iš supplied lentelės
module.exports.insertAfterApproval = function (itype, toCreate, toModify, unapproved, withErrors, regbit, db) {
  // insert statement factories
  const factInsertMain = SQLStmts.INSERT_stmtTextFactory(itype, "main");
  const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");

  let info;

  // taking each toCreate
  // inserting its main, 
  // getting main's id, 
  // setting main's id as journal mainid, 
  // inserting journal
  toCreate.forEach(mj => {
    info = db.prepare(factInsertMain(mj.main)).run(mj.main);
    if (info.changes !== 1) {
      console.error(info);
      throw Error("Error while inserting main");
    }
    mj.journal.mainid = info.lastInsertRowid;
    info = db.prepare(factInsertJournal(mj.journal)).run(mj.journal);
    if (info.changes !== 1) {
      console.error(info);
      throw Error("Error while inserting journal");
    }
  });

  // insert all journal parts
  // and shift corresponding main version
  const shiftMainVStmt = SQLStmts.SHIFT_MAIN_V_stmt(itype, db);

  toModify.forEach(mj => {
    info = db.prepare(factInsertJournal(mj.journal)).run(mj.journal);
    if (info.changes !== 1) {
      console.error(info);
      throw Error("Error while inserting journal");
    }
    info = shiftMainVStmt.run(mj.journal.mainid);
    if (info.changes !== 1) {
      console.error(info);
      throw Error("Error while shifting main version");
    }
  });

  // insert all unapproved inputs
  const insertIntoUAStmt = SQLStmts.INSERT_INTO_UNAPPROVED_stmt(db);
  unapproved.forEach(ua => {
    info = insertIntoUAStmt.run(ua)
    if (info.changes !== 1) {
      console.error(info);
      throw Error("Error while inserting unapproved");
    }
  });

  // insert all withErrors
  const insertIntoWEStmt = SQLStmts.INSERT_INTO_WITHERRORS_stmt(db);
  withErrors.forEach(we => {
    info = insertIntoWEStmt.run(we);
    if (info.changes !== 1) {
      console.error(info);
      throw Error("Error while inserting withErrors");
    }
  });

  // delete supplied of this particular itype
  info = SQLStmts.DELETE_FROM_SUPPLIED_stmt(db).run(regbit, itype);
  if (info.changes < 1) {
    console.error(info);
    throw Error("Error while deleting supplied");
  };
}

module.exports.update = function (itype, main, journal, returnRef, db) {
  let mainInfo = null;

  // net jeigu main nebuvo redaguotas, keičiasi versija
  const txtUpdateMain = SQLStmts.UPDATE_stmtTextFactory(itype, "main")(main);
  mainInfo = db.prepare(txtUpdateMain).run(main);

  let journalInfo = {};

  if (journal.update && journal.update.length) {
    const factUpdateJournal = SQLStmts.UPDATE_stmtTextFactory(itype, "journal");
    journalInfo.update = [];
    journal.update.forEach(j => {
      const txtUpdateJournal = factUpdateJournal(j);
      const jUInfo = db.prepare(txtUpdateJournal).run(j);
      journalInfo.update.push({[j.id]: jUInfo});
    });
  }

  if (journal.insert && journal.insert.length) {
    const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");
    journalInfo.insert = [];
    journal.insert.forEach(j => {
      const txtInsertJournal = factInsertJournal(j);
      const jIInfo = db.prepare(txtInsertJournal).run(j);
      journalInfo.insert.push({[j.id]: jIInfo});
    });
  }

  if (journal.delete && journal.delete.length) {
    const mainId = main.id;
    const ids = journal.delete;//.map(idStr => parseInt(idStr));
    const txtDeleteJournal = SQLStmts.DELETE_SOME_JOURNAL_stmtText(itype, ids);
    journalInfo.delete = db.prepare(txtDeleteJournal).run(mainId, ids);
  }

  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;
}