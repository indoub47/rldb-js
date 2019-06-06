const SQLStmts = require("../SQLStatements");


exports.delete = function (itype, mainData, returnRef, db) {
  const txtDeleteMain = SQLStmts.DELETE_MAIN_stmtText(itype);
  const mainInfo = db.prepare(txtDeleteMain).run(mainData);
  const txtDeleteJournal = SQLStmts.DELETE_WHOLE_JOURNAL_stmtText(itype);
  const journalInfo = db.prepare(txtDeleteJournal).run(mainData.id);
  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;   
}

exports.insert = function (itype, main, journal, returnRef, db) {
  const txtInsertMain = SQLStmts.INSERT_stmtTextFactory(itype, "main")(main);
  const mainInfo = db.prepare(txtInsertMain).run(main);
  if (mainInfo.changes !== 1) throw "Error during inserting main";
  const factInsertJournal = SQLStmts.INSERT_stmtTextFactory(itype, "journal");
  let journalInfo = [];
  journal.forEach(j => {
    j.id = mainInfo.lastInsertRowid;
    const txtInsertJournalItem = factInsertJournal(j);
    const jInfo = db.prepare(txtInsertJournalItem).run(j);
    journalInfo.push(jInfo);
  });
  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;
}

exports.update = function (itype, main, journal, returnRef, db) {
  if ("reikia updateinti main") {
    const txtUpdateMain = SQLStmts.UPDATE_stmtTextFactory(itype, "main")(main);
    const mainInfo = db.prepare(txtInsertMain).run(main);
  }

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
    const txtDeleteJournal = SQLStmts.DELETE_SOME_JOURNAL_stmtText(itype, journal.delete);
    const jDInfo = db.prepare(txtDeleteJournal).run(main.id, journal.delete);
    journalInfo.delete = jDInfo;
  }

  returnRef.mainInfo = mainInfo;
  returnRef.journalInfo = journalInfo;
}