const express = require("express");
const router = express.Router();
const passport = require("passport");
const SQLStatements = require("../SQLStatements");

const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const collName = "fsqueries";

const nameIsNotUnique = (name, email, db) => {
  const stmtText = `SELECT COUNT(*) AS count FROM ${collName} WHERE email = ? AND name = ?`;
  const stmt = db.prepare(stmtText);
  return stmt.get(email, name).count > 0;
};

const validate = (draft, exclude) => {
  let result = [];
  if (!exclude.includes("id")) {
    if (draft.id == null || !(Number.isInteger(draft.id) && draft.id > 0)) {
      result.push({
        prop: "id",
        msg: "id is required and must be a positive integer"
      });
    }
  }
  if (!exclude.includes("name")) {
    if (draft.name == null || draft.name.length < 1 || draft.name.length > 25) {
      result.push({
        prop: "name",
        msg:
          "name is required and its length must be between 1 and 25 characters"
      });
    }
  }
  if (!exclude.includes("filter")) {
    if (draft.filter != null && draft.filter.length > 500) {
      result.push({
        prop: "filter",
        msg: "filter length must up to 500 characters"
      });
    }
  }
  if (!exclude.includes("sort")) {
    if (draft.sort != null && draft.sort.length > 500) {
      result.push({
        prop: "sort",
        msg: "sort length must up to 500 characters"
      });
    }
  }
  if (!exclude.includes("itype")) {
    if (draft.itype == null || !["defect", "welding"].includes(draft.itype)) {
      result.push({
        prop: "itype",
        msg: "itype is required and must be chosen from itypes list"
      });
    }
  }
  if (!exclude.includes("email")) {
    if (
      draft.email == null ||
      draft.email.length < 5 ||
      draft.name.length > 255
    ) {
      result.push({
        prop: "email",
        msg:
          "email is required and its length must be between 5 and 255 characters"
      });
    }
  }
  if (result.length === 0) return null;
  let obj = {};
  result.forEach(item => (obj[item.prop] = item.msg));
  return obj;
};

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/fsquery/fetch
// @desc Get fsqueries for particular itype and email
// @params itype string
// @access Public
router.get("/fetch", (req, res) => {
  const email = req.user.email;
  const itype = req.query.itype;
  const stmtText = `SELECT * FROM ${collName} WHERE email = ? AND itype = ?`;
  try {
    const stmt = db.prepare(stmtText);
    const fsqueries = stmt.all(email, itype);
    return res.status(200).json(fsqueries);
  } catch (err) {
    // console.log("email, itype, err", email, itype, err);
    return res.status(500).send(err);
  }
});

// @route DELETE api/fsquery/delete
// @desc Delete fsquery
// @params id string
// @access Public
router.delete("/delete", (req, res) => {
  const email = req.user.email;
  const id = req.query.id;
  const stmtText = SQLStatements.delete(collName, 'email = ? AND id = ?');
  // email - kad apsaugoti, kad galėtų ištrinti tik savus
  try {
    const stmt = db.prepare(stmtText);
    const info = stmt.run(email, id);
    return res.status(200).json({ ...info, id });
  } catch (err) {
    // console.log("email, id, err", email, id, err);
    return res.status(500).send(err);
  }
});

// @route POST api/fsquery/update
// @desc Delete fsquery
// @body draft object
// @access Public
router.post("/update", (req, res) => {
  let draft = req.body;
  draft.email = req.user.email;

  const validation = validate(draft, ["email"]);
  if (validation) {
    return res.status(400).send(validation);
  }  

  try {
    // check if name is unique
    const stmtUniqueText = `SELECT COUNT(*) AS count FROM ${collName} WHERE email = ? AND name = ? AND itype = ? AND id <> ?`;
    const stmtUnique = db.prepare(stmtUniqueText);
    const unique =
      stmtUnique.get(draft.email, draft.name, draft.itype, draft.id).count ===
      0;
    if (!unique) return res.status(400).send({ msg: "name must be unique" });

    // perform update
    const filter = 'email = @email AND id = @id';
    const stmtText = SQLStatements.update(draft, collName, filter, ["id", "email"]);
    const stmt = db.prepare(stmtText);
    const info = stmt.run(draft);
    return res.status(200).json(draft);
  } catch (err) {
    // console.log("draft, err", draft, err);
    return res.status(500).send(err);
  }
});

// @route PUT api/fsquery/insert
// @desc Insert fsquery
// @body draft object
// @access Public
router.put("/insert", (req, res) => {
  let draft = req.body;
  draft.email = req.user.email;
  delete draft.id;
  // console.log("mark1");
  const validation = validate(draft, ["email", "id"]);
  if (validation) {
    return res.status(400).send(validation);
  }
  // console.log("mark2");
  
  try {
    // check if name is unique
    const stmtUniqueText = `SELECT COUNT(*) AS count FROM ${collName} WHERE email = ? AND name = ? AND itype = ?`;
    const stmtUnique = db.prepare(stmtUniqueText);
    const unique =
      stmtUnique.get(draft.email, draft.name, draft.itype).count === 0;
    if (!unique) return res.status(400).send({ msg: "name must be unique" });
    
    // perform insert
    const stmtText = SQLStatements.insert(draft, collName);    
    // console.log("insert stmt", stmtText);
    const stmt = db.prepare(stmtText);
    const info = stmt.run(draft);
    return res.status(200).json({ ...draft, id: info.lastInsertRowid });
  } catch (err) {
    // console.log("draft, err", draft, err);
    return res.status(500).send(err);
  }
});

module.exports = router;
