const express = require("express");
const router = express.Router();
const passport = require("passport");
const areEqual = require("../../utilities/are-equal");

//const getId = require("../../utilities/getId");
const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const collectionOptions = require("../../config/collections");
//const SQLStatements = require("../SQLStatements");
const transactions = require("../transactions");
const validate = require("../../validation/validate");

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

// Higher order function - returns a function that always runs in a transaction
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



// @route GET api/items
// @desc Get nepanaikinti items
// @access Public
router.get("/", (req, res, next) => {
  // console.log("user", req.user);
  const itype = req.body.itype || req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(404).send("no collection");
  const mainTable = coll.tables.main.name;
  const journalTable = coll.tables.journal.name;
  let filter = " WHERE regbit = ?";
    if (!req.query.all) {
    filter += " AND " + coll.notPanaikinta;
  }

  //const getLastJournal = "SELECT * FROM " + journalTable + 
  
  try {    
  /*
  SELECT defects.*, j.* FROM defects INNER JOIN (SELECT MIN(data), * FROM defectj GROUP BY mainid) AS j ON defects.id = j.mainid where defects.regbit = 8 order by defects.id;
  */
  /*
  WITH lastjs AS (SELECT j.*, ROW_NUMBER() OVER (PARTITION BY mainid ORDER BY data DESC) as rn FROM ${journalTable} AS j)
  SELECT ${mainTable}.*, lastjs.* FROM ${mainTable} INNER JOIN lastjs ON ${mainTable}.id = lastjs.mainid WHERE lastjs.rn = 1 ${mainTable}.regbit = 8;
  */
    const stmtText = `SELECT ${mainTable}.*, j.* FROM ${mainTable} INNER JOIN (SELECT MAX(data) AS md, * FROM ${journalTable} GROUP BY mainid) AS j ON ${mainTable}.id = j.mainid` + filter;
    // console.log("stmtText:", stmtText);
    const items = db.prepare(stmtText).all(req.user.regbit);
    // console.log("items", items);
    return res.status(200).send(items);
  } catch (error) {
    // console.log(error);
    return res.status(500).send(error);
  }
});

// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post("/update", (req, res) => {
  const itype = req.body.itype || req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(400).send({
    ok: 0,
    reason: "bad criteria",
    msg: "no collection " + itype
  });

  // check if sufficient rights to update
  if (!coll.permissions.update.includes(req.user.role)) {
    return res.status(403).send({
      ok: 0,
      reason: "bad criteria",
      msg: `tu neturi teisės redaguoti ${coll.itemNames.Item} įrašų`
    });
  }

  // validate draft here. returns either {errors: []} or {item: {}}
  // console.log("draft before validation", req.body.draft);
  const result = validate(req.body.draft, itype, false);

  if (result.errors) {
    // console.log("validation result", result);
    return res.status(400).send({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
    });
  }
  
  // console.log("draft after validation", result.item);
  let main = result.item.main;
  let journal = result.item.journal;  
  const mainId = main.id;
  
  // just check if still exists
  let found = null;
  try {
    const findStmtText = "SELECT * FROM " + mainTable + " WHERE id = ? AND regbit = ?";
    found = db.prepare(findStmtText).get(mainId, req.user.regbit);
    // console.log("found", found);
    if (!found) {
      return res.status(404).send({
        ok: 0,
        reason: "bad criteria",
        msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes yra ištrintas iš serverio`
      });
    }
  } catch (error) {
    return res.status(500).send({
      ok: 0,
      reason: "server error",
      msg: "Serverio klaida, mėginant atsisiųsti originalų objektą"
    });
  }

  // check if draft version doesn't equal db version
  if (found.v !== main.v) {
    return res.status(409).send({
      ok: 0,
      reason: "bad criteria",
      msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas - jis ką tik buvo redaguotas kažkieno kito`
    });
  }

  // check if there exist some record with the same place
  if (coll.samePlace) {
    let samePlaceFilter = " WHERE id <> @id AND regbit = ?";
    samePlaceFilter += " AND " + coll.notPanaikinta;
    samePlaceFilter += " AND " + coll.samePlace;
    try {
      const spStmtText = "SELECT * FROM " + coll.tables.main.name + samePlaceFilter;
      const samePlaceItem = db.prepare(spStmtText).get(main, req.user.regbit);
      if (samePlaceItem) {
        return res.status(400).send({
          ok: 0,
          reason: "bad draft",
          msg: `${coll.itemNames.Item} nepakeistas - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceItem.id}`
        });
      }
    } catch (error) {
      return res.status(500).send({
        ok: 0,
        reason: "server error",
        msg: `Serverio klaida, mėginant patikrinti, ar toje pačioje vietoje yra kitas ${coll.itemNames.item}`
      });
    }    
  }  

  // same place not found, update item
  main.v += 1;
  const updateItem = asTransaction(transactions.update);
  let returnRef = {};

  updateItem(itype, main, journal, returnRef, db);
  if (returnRef.mainInfo.changes < 1) {
    return res.status(500).send({
      ok: 0,
      reason: "server error",
      msg: "Klaida, mėginant redaguoti objektą DB"
    });
  }

  // fetch updated version
  try {
    const updatedMain = db.prepare(`SELECT * FROM ${coll.tables.main.name} WHERE id = ?`).get(mainId);
    const updatedJournal = db.prepare(`SELECT * FROM ${coll.tables.journal.name} WHERE mainid = ?`).all(mainId);
    return res.status(200).send({
      ok: 1,
      msg: `${coll.itemNames.Item}, kurio ID ${mainId}, sėkmingai pakeistas`,
      item: {main: updatedMain, journal: updatedJournal}
    });
  } catch (error) {
    // console.log(error);
    return res.status(200).send({
      ok: 0,
      reason: "server error",
      msg: `${coll.itemNames.Item}, kurio ID ${mainId}, buvo pakeistas, bet mėginant atsisiųsti atnaujintą įrašo versiją, įvyko duomenų bazės klaida. Siūloma atnaujinti įrašus programoje`,
      item: {main, journal}
    });
  }
});



// @route PUT api/items/insert
// @desc Insert item
// @access Public
router.put("/insert", (req, res, next) => {
  const itype = req.body.itype || req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(400).send({
    ok: 0,
    reason: "bad criteria",
    msg: "no collection " + itype
  });

  // check if sufficient rights to update
  if (!coll.permissions.insert.includes(req.user.role)) {
    return res.status(403).send({
      ok: 0,
      reason: "bad criteria",
      msg: `tu neturi teisės kurti ${coll.name} įrašų`
    });
  }

  // validate draft here. returns either {errors: []} or {item: {}}
  // console.log("draft before validation", req.body.draft);
  const result = validate(req.body.draft, itype, true);

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
  if (coll.samePlace) {
    let samePlaceFilter = " WHERE regbit = ?";
    samePlaceFilter += " AND " + coll.notPanaikinta;
    samePlaceFilter += " AND " + coll.samePlace;
    try {
      const spStmtText = "SELECT * FROM " + coll.tables.main.name + samePlaceFilter;
      const samePlaceItem = db.prepare(spStmtText).get(main, req.user.regbit);
      if (samePlaceItem) {
        return res.status(400).send({
          ok: 0,
          reason: "bad draft",
          msg: `${coll.itemNames.Item} nesukurtas - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceItem.id}`
        });
      }
    } catch (error) {
      return res.status(500).send({
        ok: 0,
        reason: "server error",
        msg: "Serverio klaida, mėginant patikrinti ar toje pačioje vietoje yra ${coll.itemNames.item}"
      });
    }    
  }  
  
  const insertItem = asTransaction(transactions.insert);
  let returnRef = {};
  insertItem(itype, main, journal, returnRef, db);
  if (returnRef.mainInfo.changes < 1) {
    return res.status(500).send({
      ok: 0,
      reason: "server error",
      msg: "Serverio klaida, mėginant įrašyti naują objektą į DB"
    });
  }

  const mainId = returnRef.mainInfo.lastInsertRowid;

  // fetch inserted version
  try {
    const insertedMain = db.prepare(`SELECT * FROM ${coll.tables.main.name} WHERE id = ?`).get(mainId);
    const insertedJournal = db.prepare(`SELECT * FROM ${coll.tables.journal.name} WHERE mainid = ?`).all(mainId);
    return res.status(200).send({
      ok: 1,
      msg: `${coll.itemNames.Item} sėkmingai sukurtas. Jo ID - ${mainId}`,
      item: {main: insertedMain, journal: insertedJournal}
    });
  } catch (error) {
    // console.log("fetch inserted item error", error);
    return res.status(200).send({
      ok: 0,
      reason: "server error",
      msg:  `${coll.itemNames.Item}, kurio id ${mainId}, buvo sukurtas, bet mėginant atsisiųsti atnaujintą įrašo versiją, įvyko duomenų bazės klaida. Siūloma atnaujinti įrašus programoje`,
      item: {main, journal}
    });
  }
});

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete("/delete", (req, res, next) => {
  const itype = req.body.itype || req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(400).send({
    ok: 0,
    reason: "bad criteria",
    msg: "no collection " + itype
  });

  // check if sufficient rights to update
  if (!coll.permissions.delete.includes(req.user.role)) {
    return res.status(403).send({
      ok: 0,
      reason: "bad criteria",
      msg: `tu neturi teisės naikinti ${coll.itemNames.Item} įrašų`
    });
  }  
  
  let returnRef = {};
  const mainData = {id: parseInt(req.query.id), v: parseInt(req.query.v), regbit: req.user.regbit};

  const deleteItem = asTransaction(exports.delete);

  deleteItem(itype, mainData, returnRef, db);
  if (returnRef.mainInfo.changes > 0) {
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

// error handler
router.use((err, req, res, next) => {
  if (!err.status) {
    console.error(err);
  }
  return res.status(err.status || 500).send(err);
});

module.exports = router;
