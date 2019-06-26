const express = require("express");
const router = express.Router();
const passport = require("passport");
const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
//const collectionOptions = require("../../config/collections");
const getCollection = require("../middleware/getCollection");
const checkPermissions = require("../middleware/checkPermissions");
const checkSamePlace = require("../middleware/checkSamePlace");
const fetchResult = require("../middleware/fetchResult");
const transactions = require("../transactions");
const validate = require("../../validation/validate");

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

//db.defaultSafeIntegers();

// A function that always runs in a transaction
function asTransaction(func) {
  return function (...args) {
    begin.run();
    try {
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}


// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// get collection
router.use(getCollection);

// @route GET api/items
// @desc Get nepanaikinti items
// @access Public
router.get("/", (req, res, next) => {

  const coll = res.locals.coll;
  const viewAllLastJ = coll.tables.viewAllLastJ.name;
  let filter = " WHERE regbit = ?";
    if (!req.query.all) {
    filter += " AND " + coll.notPanaikinta;
  }

  try {    
  /*
  SELECT defects.*, j.* FROM defects INNER JOIN (SELECT MIN(data), * FROM defectj GROUP BY mainid) AS j ON defects.id = j.mainid where defects.regbit = 8 order by defects.id;
  */
  /*
  WITH lastjs AS (SELECT j.*, ROW_NUMBER() OVER (PARTITION BY mainid ORDER BY data DESC) as rn FROM ${journalTable} AS j)
  SELECT ${mainTable}.*, lastjs.* FROM ${mainTable} INNER JOIN lastjs ON ${mainTable}.id = lastjs.mainid WHERE lastjs.rn = 1 ${mainTable}.regbit = 8;
  */
    const stmtText = `SELECT * FROM ${viewAllLastJ}` + filter;
    const items = db.prepare(stmtText).all(req.user.regbit);
    return res.status(200).send(items);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post("/update",
  checkPermissions("update", "redaguoti"),
  (req, res, next) => {

  const coll = res.locals.coll;
  const itype = res.locals.itype;

  // validate draft here. returns either {errors: []} or {item: {}}
  const result = validate(req.body.main, req.body.journal, itype, false);

  if (result.errors) {
    return res.status(400).json({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
    });
  }
  
  let main = result.item.main;
  main.regbit = req.user.regbit;
  let journal = result.item.journal;  
  const mainId = main.id;
  
  // just check if still exists
  let found = null;
  try {
    const findStmtText = "SELECT * FROM " + coll.tables.main.name + " WHERE id = ? AND regbit = ?";
    found = db.prepare(findStmtText).get(mainId, req.user.regbit);
    if (!found) {
      return res.status(404).send({
        ok: 0,
        reason: "bad criteria",
        msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes yra ištrintas iš serverio`
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: 0,
      reason: "server error",
      msg: "Serverio klaida, mėginant atsisiųsti originalų objektą"
    });
  }

  // check if draft version equals db version
  if (found.v !== main.v) {
    return res.status(409).send({
      ok: 0,
      reason: "bad criteria",
      msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
    });
  }  

  // check if there exist some record with the same place
  const spResult = checkSamePlace(main, "update", "neredaguotas", res, req, db);
  console.log("same place result", spResult);
  if (spResult !== "nosameplace") return;

  // same place not found, update item
  main.v += 1;
  journal.insert && journal.insert.forEach(i => i.mainid = mainId);
  journal.update && journal.update.forEach(i => i.mainid = mainId);
  const updateItem = asTransaction(transactions.update);
  let returnRef = {};
  //console.log("journal.insert before update", journal.insert);
  try {
    updateItem(itype, main, journal, returnRef, db);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      ok: 0,
      reason: "server error",
      msg: "Nepavyko redaguoti objekto DB"
    });
  }

  res.locals.mainId = mainId;
  res.locals.draftMain = main;
  res.locals.draftJournal = journal;
  res.locals.db = db;
  next();
},
fetchResult("paredaguotas"));



// @route PUT api/items/insert
// @desc Insert item
// @access Public
router.put("/insert",
  checkPermissions("insert", "kurti"),
  (req, res, next) => {
  console.log("res.locals", res.locals);
  
  const coll = res.locals.coll;
  const itype = res.locals.itype;

  // validate draft here. returns either {errors: []} or {item: {}}
  // console.log("draft before validation", req.body.draft);
  const result = validate(req.body.main, req.body.journal, itype, true);

  if (result.errors) {
    // console.log("validation result", result);
    return res.status(400).send({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
    });
  }
  
  let main = result.item.main;
  let journal = result.item.journal;
  
  main.regbit = req.user.regbit;
  main.v = 0;
  delete main.id;

  // check if there exist some record with the same place
  const spResult = checkSamePlace(main, "insert", "nesukurtas", res, req, db);
  console.log("same place result", spResult);
  if (spResult !== "nosameplace") return;

  
  const insertItem = asTransaction(transactions.insert);
  let returnRef = {};

  try {
    insertItem(itype, main, journal, returnRef, db);
  } catch (err) {
    console.log("err", err, err.msg, err.message);
    return res.status(500).send({
      ok: 0,
      reason: "server error",
      msg: "Nepavyko įrašyti naujo objekto į DB"
    });
  }

  res.locals.mainId = returnRef.mainInfo.lastInsertRowid;
  res.locals.draftMain = main;
  res.locals.draftJournal = journal;
  res.locals.db = db;
  next();
},
fetchResult("sukurtas"));

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete("/delete", 
  checkPermissions("delete", "naikinti"), 
  (req, res, next) => {

  const coll = res.locals.coll;
  const itype = res.locals.itype;
  
  let returnRef = {};
  const mainData = {id: parseInt(req.query.id), v: parseInt(req.query.v), regbit: req.user.regbit};

  const deleteItem = asTransaction(transactions.delete);

  deleteItem(itype, mainData, returnRef, db);
  if (returnRef.mainInfo.changes < 1) {
    return res.status(500).send({
      ok: 0,
      reason: "unknown",
      msg: `${coll.itemNames.Item} nebuvo pašalintas, nes arba įvyko serverio klaida, arba toks id nerastas, arba nesutampa versijos.`
    });
  } else {
    return res.status(200).send({
      ok: 1,
      msg: `${coll.itemNames.Item}, kurio id ${req.query.id}, pašalintas`,
      id: parseInt(req.query.id)
    }); 
  }
});

module.exports = router;
