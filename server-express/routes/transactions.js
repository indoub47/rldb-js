const SQLStmts = require("./SQLStatements");

module.exports.delete = function(itype, mainData, returnRef, db) {
  const txtDeleteMain = SQLStmts.DELETE_MAIN_stmtText(itype);
  const mainInfo = db.prepare(txtDeleteMain).run(mainData);
  const deleteJournalStmt = SQLStmts.DELETE_WHOLE_JOURNAL_stmt(itype, db);
  const journalInfo = deleteJournalStmt.run(mainData.id);
  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;
};

module.exports.insert = function(itype, main, journal, returnRef, db) {
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
};

// grąžina funciją, kuri sukuria naują įrašą iš supplied:
// - insert main
// - info.lastInsertRowId panaudojamas kaip journal.mainid
// - insert journal
// - delete from supplied
// TODO: atskirti create ir delete ir vėliau sukombinuoti į vieną funkciją
module.exports.createRecord = (itype, db) => {
  const factInsertMain = SQLStmts.INSERT_stmtTextFactory(itype, "main");
  const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");
  const deleteFromSupplied = SQLStmts.DELETE_FROM_SUPPLIED_BY_ID_stmt(db);

  return item => {
    const mainInfo = db.prepare(factInsertMain(item.main)).run(item.main);
    if (mainInfo.changes !== 1) {
      console.error(mainInfo);
      throw Error("Error while inserting main");
    }
    item.journal.mainid = mainInfo.lastInsertRowid;
    const journalInfo = db
      .prepare(factInsertJournal(item.journal))
      .run(item.journal);
    if (journalInfo.changes !== 1) {
      console.error(journalInfo);
      throw Error("Error while inserting journal");
    }
    deleteFromSupplied(item.id);
  };
};

// grąžina funciją, kuri iš supplied: sukuria naują journal esamam įrašui
// - insert journal
// - shift main.v
// - delete from supplied
// TODO: atskirti create ir delete ir vėliau sukombinuoti į vieną funkciją
module.exports.modifyRecord = (itype, db) => {
  const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");
  const shiftMainVStmt = SQLStmts.SHIFT_MAIN_V_stmt(itype, db);
  const deleteFromSupplied = SQLStmts.DELETE_FROM_SUPPLIED_BY_ID_stmt(db);

  return item => {
    const journalInfo = db
      .prepare(factInsertJournal(item.journal))
      .run(item.journal);
    if (journalInfo.changes !== 1) {
      console.error(journalInfo);
      throw Error("Error while inserting journal");
    }
    const versionInfo = shiftMainVStmt.run(item.journal.mainid);
    if (versionInfo.changes !== 1) {
      console.error(versionInfo);
      throw Error("Error while shifting main version");
    }
    deleteFromSupplied(item.id);
  };
};

module.exports.deleteSuppliedById = db => {
  const preparedStmt = SQLStatements.DELETE_FROM_SUPPLIED_BY_ID_stmt(db);
  return id => preparedStmt.run(id);
};

module.exports.returnToOper = db => {
  const insertUnapprovedStmt = SQLStatements.INSERT_INTO_UNAPPROVED_stmt(db);
  const deleteFromSuppliedStmt = SQLStatements.DELETE_FROM_SUPPLIED_BY_ID_stmt(
    db
  );
  return input => {
    const jsonstr = JSON.stringify(input);
    insertUnapprovedStmt.run(input.oper, input.itype, jsonstr);
    deleteFromSuppliedStmt.run(input.id);
  };
};

module.exports.update = function(itype, main, journal, returnRef, db) {
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
      journalInfo.update.push({ [j.id]: jUInfo });
    });
  }

  if (journal.insert && journal.insert.length) {
    const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");
    journalInfo.insert = [];
    journal.insert.forEach(j => {
      const txtInsertJournal = factInsertJournal(j);
      const jIInfo = db.prepare(txtInsertJournal).run(j);
      journalInfo.insert.push({ [j.id]: jIInfo });
    });
  }

  if (journal.delete && journal.delete.length) {
    const mainId = main.id;
    const ids = journal.delete; //.map(idStr => parseInt(idStr));
    const txtDeleteJournal = SQLStmts.DELETE_SOME_JOURNAL_stmtText(itype, ids);
    journalInfo.delete = db.prepare(txtDeleteJournal).run(mainId, ids);
  }

  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;
};
