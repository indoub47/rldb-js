const express = require("express");
const router = express.Router();
const passport = require("passport");
const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const modelProvider = require("../../models/modelProvider");
const getCollection = require("../middleware/getCollection");

const transactions = require("../transactions");
const validate = require("../../validation/validate").validateItemPair;
const checkSamePlace = require("../middleware/checkSamePlace").bareQuery;
const checkIfExists = require("../middleware/checkIfExists").bareQuery;
const splitMainJournal = require("../middleware/splitMainJournal");
const parseMainJournal = require("../middleware/parseMainJournal");
const validateSupplied = require("../middleware/validateSupplied");

const begin = db.prepare("BEGIN");
const commit = db.prepare("COMMIT");
const rollback = db.prepare("ROLLBACK");

// A function that always runs in a transaction
function asTransaction(func) {
  // console.log("func1", func);
  return function(...args) {
    begin.run();
    try {
      // console.log("func2", func);
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}



// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET /api/operinput/supplied
// @desc Get supplied inputs of particular region and particular itype
// @access Public
router.get("/supplied", getCollection, (req, res) => {
  // patikrinti ar turi teisę
  const itype = req.query.itype;
  const admRegbit = req.user.regbit;
  const coll = res.locals.coll;

  const stmtText = `SELECT * FROM supplied WHERE itype = ? AND regbit = ?`;
  let fetched = null;

  try {
    fetched = db.prepare(stmtText).all(itype, admRegbit);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }

  if (fetched.length < 1) return res.status(200).send([]);

  // json to object
  fetched.forEach(item => parseMainJournal(item));

  // Visus įrašus padalinti į kuriamus naujus ir modifikuojamus.
  // Modifikuojamų id teigiamas, kuriamų naujų id neigiamas.
  let toCreate = fetched.filter(i => i.main.id < 0);
  let toModify = fetched.filter(i => i.main.id > 0);

  // validate drafts
  validateSupplied.toCreate(toCreate, coll, admRegbit, itype, db);
  validateSupplied.toModify(toModify, coll, admRegbit, itype, db);
  // Each invalid item has gotten .validation prop:
  // {reason: "string", (optional) errors: []}

  // merge back into single array
  const merged = toCreate.concat(toModify);

  return res.status(200).send(merged);
});

// @route GET /api/operinput/unapproved
// @desc Get unapproved inputs of particular region and particular useremail
// @access Public
router.get("/unapproved", (req, res) => {
  const itype = req.query.itype;
  const oper = req.user.code;

  const stmtText = `SELECT input FROM unapproved WHERE itype = ? AND oper = ?`;
  try {
    const items = db.prepare(stmtText).all(itype, oper);
    return res.status(200).send(items);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// @route POST /api/operinput/supply
// @desc Sends operinput to the temporary storage on the database
// @access PUblic
router.post("/supply", (req, res) => {
  const itype = req.body.itype;
  const input = req.body.input;
  const oper = req.user.code || req.user.email;
  const regbit = req.user.regbit;

  const insertStmt = db.prepare(
    "INSERT INTO supplied (main, journal, itype, oper, regbit, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const deleteStmt = db.prepare(
    "DELETE FROM unapproved WHERE itype = ? AND oper = ?"
  );

  const transFunc = (input, itype, oper, regbit) => {
    const model = modelProvider[itype];
    input.forEach(inp => {
      const split = splitMainJournal(inp, model);
      insertStmt.run(
        JSON.stringify(split.main),
        JSON.stringify(split.journal),
        itype,
        oper,
        regbit,
        Date.now()
      );
    });
    deleteStmt.run(itype, oper);
  };

  const transaction = asTransaction(transFunc);

  try {
    transaction(input, itype, oper, regbit);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
  res.status(200).send({ ok: 1 });
});

router.put("/insert", getCollection, (req, res) => {
  const itype = req.body.itype;
  let apprInput = req.body.input.approved;
  const unapprInput = req.body.input.unapproved;
  const regbit = req.user.regbit;

  // return unapproved inputs
  // group by oper
  const groupedByOper = unapprInput.reduce((acc, current) => {
    const tmp = acc[current.oper] || [];
    tmp.push(current);
    acc[current.oper] = tmp;
    return acc;
  }, {});

  // array of objects for inserting into unapproved table
  const unapproved = Object.keys(groupedByOper).map(oper => {
    const input = JSON.stringify(groupedByOper[oper]);
    return { input, oper, itype };
  });

  // insert approved inputs
  // get model
  const model = modelProvider[itype];

  // Visus įrašus apprInput padalinti į kuriamus naujus ir modifikuojamus.
  // Modifikuojamų id teigiamas, kuriamų naujų id neigiamas.
  // Įrašus perskelti į main ir journal dalis.
  apprInput = apprInput.map(i => splitToMainJournal(i, model));
  console.log("apprInput", apprInput);
  let toCreate = apprInput.filter(i => i.main.id < 0);
  let toModify = apprInput.filter(i => i.main.id > 0);

  // validate drafts
  let vResult;
  // Kuriamų naujų validinti ir main, ir journal
  toCreate.forEach(item => {
    vResult = validate(item.main, item.journal, itype, true, "both");

    if (vResult.errors) {
      item.validation = { reason: "draft", errors: vResult.errors };
    } else {
      item.main = vResult.item.main;
      item.journal = vResult.item.journal;
    }
  });

  // Modifikuojamų validinti tik journal
  toModify.forEach(item => {
    vResult = validate(item.main, item.journal, itype, true, "journal");
    if (vResult.errors) {
      item.validation = { reason: "draft", errors: vResult.errors };
    } else {
      item.journal = vResult.item.journal;
    }
  });

  const coll = res.locals.coll;

  // toCreate - test for samePlace
  toCreate
    .filter(item => !item.validation)
    .forEach(item => {
      try {
        if (checkSamePlace(coll, "insert", item.main, regbit, db)) {
          item.validation = { reason: "same place" };
        }
      } catch (error) {
        console.error(error);
        item.validation = { reason: "server error", errors: [error] };
      }
    });

  // toModify - check if exists, check version and test for samePlace
  toModify
    .filter(item => !item.validation)
    .forEach(item => {
      try {
        const found = checkIfExists(item.main.id, coll, regbit, db);
        if (!found) {
          item.validation = { reason: "not found" };
        } else if (found.v !== item.main.v) {
          item.validation = { reason: "bad version" };
        } else if (checkSamePlace(coll, "update", item.main, regbit, db)) {
          item.validation = { reason: "same place" };
        }
      } catch (error) {
        console.error(error);
        item.validation = { reason: "server error", errors: [error] };
      }
    });

  // filter out withErrors, pack them together with itype and regbit
  const withErrors = toCreate
    .filter(item => !!item.validation)
    .concat(toModify.filter(item => !!item.validation))
    .map(item => ({ input: JSON.stringify(item), regbit, itype }));

  toCreate = toCreate.filter(item => !item.validation);
  toModify = toModify.filter(item => !item.validation);

  // insert
  //console.log("transactions.insertAfterApproval", transactions.insertAfterApproval);
  //console.log("typeof transactions.insertAfterApproval", typeof transactions.insertAfterApproval);
  const transaction = asTransaction(transactions.insertAfterApproval);
  //console.log("transaction", transaction);

  try {
    transaction(itype, toCreate, toModify, unapproved, withErrors, regbit, db);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      ok: 0,
      reason: "server error",
      msg: "operacija nepavyko"
    });
  }

  res.status(200).send({
    ok: 1,
    withErrors: withErrors.length,
    unapproved: unapprInput.length,
    created: toCreate.length,
    modified: toModify.length
  });
});

module.exports = router;
