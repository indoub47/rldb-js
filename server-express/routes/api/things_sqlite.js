const express = require("express");
const router = express.Router();
const passport = require("passport");
const settings = require("../../config/settings");
const secret = require("../../config/secret");
const collections = settings.COLLECTIONS;
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;

const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});

const regionFilter = queryRegion => {
  return `(region IS NULL OR region = "" OR region = ${queryRegion})`;
};

const insertStatement = (ttype, draft) => {
  return `INSERT INTO ${ttype} VALUES (${Object.keys(draft)
    .map(key => `@${key}`)
    .join(", ")})`;
};

const updateStatement = (ttype, draft) => {
  return `UPDATE ${ttype} SET ${Object.keys(draft)
    .map(key => `${key} = @${key}`)
    .join(", ")} WHERE id = @id`;
};



// @route GET api/sqlite/things/register
// @desc Get register things as one object
// @access Public

router.get("/register", (req, res) => {
  // which collections to return
  const colls = collections
    .filter(c => c.actions.includes("register_user"))
    .map(c => c.name);

  // will be collected result
  var resultObject = {};

  colls.forEach(coll => {
    try {
      const stmt = db.prepare(`SELECT * FROM ${coll}`);
      const collItems = stmt.all();
      // console.log("coll, collItems", coll, collItems);
      resultObject[coll] = collItems;
    } catch (err) {
      console.log("coll error", coll, err);
      return res.status(500).send(err);
    }
  });
  //console.log("resultObject", resultObject);
  return res.status(200).json(resultObject);
});

// visi kiti - reikia autorizuotis
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/sqlite/things
// @desc Get things defined by ttype param
// @access Public
router.get("/", (req, res, next) => {
  const coll = collections.find(c => c.name === req.query.ttype);
  try {
    let stmtText = `SELECT * FROM ${coll.name}`;
    if (coll.hasRegion) {
      stmtText += ` WHERE ${regionFilter(req.user.region)}`;
    }
    stmt = db.prepare(stmtText);
    const items = stmt.all();
    return res.status(200).json(items);
  } catch (err) {
    console.log("coll error", coll, err);
    return res.status(500).send(err);
  }
});

// @route GET api/sqlite/things/all
// @desc Get all things as one object
// @access Public
router.get("/all", (req, res) => {
  // will be collected result
  var resultObject = {};

  collections
    .filter(c => c.actions.includes("all"))
    .forEach(coll => {
      try {
        let selectStmt = `SELECT * FROM ${coll.name}`;
        if (coll.hasRegion)
          selectStmt += ` WHERE ${regionFilter(req.user.region)}`;
        const stmt = db.prepare(selectStmt);
        const collItems = stmt.all();
        // console.log("coll, collItems", coll, collItems);
        resultObject[coll.name] = collItems;
      } catch (err) {
        console.log("coll error", coll, err);
        return res.status(500).send(err);
      }
    });
  //console.log("resultObject", resultObject);
  return res.status(200).json(resultObject);
});

// @route POST api/sqlite/things/update
// @desc Update things (replace by draft)
// @access Public
router.post("/update", (req, res) => {
  const ttype = req.body.ttype;
  const coll = collections.find(c => c.name === ttype);
  if (!coll) return res.status(404).send({ msg: "collection not found" });

  let draft = JSON.parse(req.body.draft);

  let rFilter = "";
  if (coll.hasRegion) {
    draft.region = req.user.region; // kad nepakeistų regiono
    rFilter = ` AND ${regionFilter(req.user.region)}`; // kad neupdateintų ne savo regiono
  } else {
    delete draft.region;
  }

  const updateStmt = updateStatement(ttype, draft) + rFilter;
  try {
    const stmt = db.prepare(updateStmt);
    const info = stmt.run(draft);
    return res.status(200).json(draft);
  } catch (err) {
    console.log("draft error", draft, err);
    return res.status(500).send(err);
  }
});

// @route PUT api/sqlite/things/insert
// @desc Create thing
// @access Public
router.put("/create", (req, res) => {
  console.log("ttype, draft", req.body.ttype, req.body.draft);
  const coll = collections.find(c => c.name === req.body.ttype);
  if (!coll) return res.status(404).send({ msg: "collection not found" });

  let draft = JSON.parse(req.body.draft);

  if (coll.autoId) {
    delete draft.id;
  } else {
    // check if draft has id property
    console.log("draft", draft);
    console.log("draft.id", draft["id"]);
    if (!draft.id) {
      return res.status(400).send({ msg: "id is required" });
    }

    // check if id is unique
    try {
      const stmtCount = db.prepare(
        `SELECT COUNT(*) AS count FROM ${coll.name} WHERE id = ?`
      );
      const result = stmtCount.get(draft.id);
      console.log("result", result);
      if (result.count > 0)
        return res.status(400).send({ msg: "id must be unique" });
    } catch (err) {
      console.log("error", err);
      return res.status(500).send(err);
    }
  }

  if (coll.hasRegion) {
    draft.region = req.user.region; // kad neįdėtų ne savo regionui
  } else {
    delete draft.region;
  }

  // insert new item
  try {
    const stmt = db.prepare(insertStatement(req.body.ttype, draft));
    const info = stmt.run(draft);
    if (info.changes === 1) {
      if (coll.autoId) draft.id = info.lastInsertRowid;
      return res.status(200).json(draft); // SUCCESS
    }
    return res.status(500).send({ msg: "not inserted" });
  } catch (err) {
    console.log("error", err);
    return res.status(500).send(err);
  }
});

// @route DELETE api/sqlite/things/delete
// @desc Delete thing
// @access Public
router.delete("/delete", (req, res) => {
  const coll = collections.find(c => c.name === req.body.ttype);
  if (!coll) return res.status(404).send({ msg: "collection not found" });  
  console.log("coll", coll);
  console.log("id", req.body.id);

  let stmtText = `DELETE FROM ${req.body.ttype} WHERE id = ?`;
  if (coll.hasRegion) {
    stmtText += ` AND ${regionFilter(req.user.region)}`;
  }

  try {
    console.log("stmtText", stmtText);
    const stmt = db.prepare(stmtText);
    const info = stmt.run(req.body.id);
    if (info.changes > 0) {
      return res.status(200).send(info); // SUCCESS
    }
    return res.status(200).send({ ...info, msg: "item not found" });
  } catch (err) {
    return res.status(500).send({...err, msg: "bbz"});
  }
});

router.get("/test", (req, res) => {
  const collname = "linst";
  const ind = 3;
  const stmtText = "SELECT COUNT(*) as count FROM linst WHERE ind > ?";
  const stmt = db.prepare(stmtText);
  const result = stmt.get(ind);
  console.log("result", result);
  return res.status(200).send(result);
});

module.exports = router;
