const express = require("express");
const router = express.Router();
const passport = require("passport");
const areEqual = require("../../utilities/are-equal");

const getId = require("../../utilities/getId");
const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const COLLECTIONMAP = require("../../config/settings").COLLECTION_MAP;
const SQLStatements = require("../SQLStatements");
const validate = require("../../validation/validate");


// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));




// // connect database middleware
// router.use(connectDb);

// // connect database middleware
// const connectDb = (req, res, next) => {
//   MongoClient.connect(
//     dbUri,
//     { useNewUrlParser: true },
//     (err, client) => {
//       if (err) {
//         next(err);
//       } else {
//         req.bnbldb = {};
//         const itype = req.body.itype || req.query.itype;
//         if (!itype) return res.status(404).send("no itype");
//         const coll = collectionMap.find(c => c.itype === itype);
//         if (!coll) return res.status(404).send("no collection");
//         req.bnbldb.collection = client.db(dbName).collection(coll.name);
//         req.bnbldb.names = coll.itemNames;
//         return next();
//       }
//     }
//   );
// };



// @route GET api/items
// @desc Get nepanaikinti items
// @access Public
router.get("/", (req, res, next) => {
  console.log("user", req.user);
  const itype = req.body.itype || req.query.itype;
  const coll = COLLECTIONMAP.find(c => c.itype === itype);
  if (!coll) return res.status(404).send("no collection");
  let filter = " WHERE regbit = ?";
    if (!req.query.all) {
    filter += " AND " + coll.notPanaikinta;
  }
  
  try {    
    const stmtText = "SELECT * FROM " + coll.name + filter;
    console.log("stmtText:", stmtText);
    const items = db.prepare(stmtText).all(req.user.regbit);
    //console.log("items", items);
    return res.status(200).send(items);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post("/update", (req, res) => {
  const itype = req.body.itype || req.query.itype;
  const coll = COLLECTIONMAP.find(c => c.itype === itype);
  if (!coll) return res.status(400).send({
    ok: 0,
    reason: "bad criteria",
    msg: "no collection " + itype
  });

  // check if sufficient rights to update
  if (!coll.updateBy.includes(req.user.role)) {
    return res.status(403).send({
      ok: 0,
      reason: "bad criteria",
      msg: `tu neturi teisės redaguoti ${coll.name} įrašų`
    });
  }

  // validate draft here
  //console.log("draft before validation", req.body.draft);
  const result = validate(req.body.draft, itype, false);
  if (result.hasErrors) {
    console.log("validation result", result);
    return res.status(400).send({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
    });
  }
  
  let draft = result.item;  
  //console.log("draft after validation", draft);
  const draftId = draft.id;
  const draftV = draft.v;
  
  // just check if still exists
  let found = null;
  try {
    const findStmtText = "SELECT * FROM " + coll.name + " WHERE id = ? AND regbit = ?";
    found = db.prepare(findStmtText).get(draftId, req.user.regbit);
    //console.log("found", found);
    if (!found) {
      return res.status(404).send({
        ok: 0,
        reason: "bad criteria",
        msg: `${coll.itemNames.Item}, kurio ID ${draftId}, nepakeistas, nes yra ištrintas iš serverio`
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
  if (found.v !== draftV) {
    return res.status(409).send({
      ok: 0,
      reason: "bad criteria",
      msg: `${coll.itemNames.Item}, kurio ID ${draftId}, nepakeistas - jis ką tik buvo redaguotas kažkieno kito`
    });
  }

  // check if both are Equal
  if (areEqual(draft, found)) {
    return res.status(400).send({
      ok: 0,
      reason: "bad draft",
      msg: `${coll.itemNames.Item} nepakeistas, nėra reikalo atnaujinti - ${coll.itemNames.item} toks pat kaip ir serveryje`
    });
  }

  // check if there exist some record with the same place
  if (coll.samePlace) {
    let spFilter = " WHERE id <> @id AND regbit = ?";
    spFilter += " AND " + coll.notPanaikinta;
    spFilter += " AND " + coll.samePlace;
    try {
      const spStmtText = "SELECT * FROM " + coll.name + spFilter;
      const samePlaceItem = db.prepare(spStmtText).get(draft, req.user.regbit);
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
        msg: "Serverio klaida, mėginant patikrinti ar toje pačioje vietoje yra objektas"
      });
    }    
  }

  // same place not found, update item
  draft.v += 1;
  const filter = `id = @id AND regbit = @regbit`;
  try {
    const stmtText = SQLStatements.update(draft, coll.name, filter, ["id", "regbit"]);
    const info = db.prepare(stmtText).run(draft);
    if (info.changes = 0) {
      return res.status(500).send({
        ok: 0,
        reason: "unknown",
        msg: `${coll.itemNames.Item}, kurio ID ${draftId}, nepakeistas dėl nežinomos priežasties`
      });
    }
  } catch (error) {
      return res.status(500).send({
        ok: 0,
        reason: "server error",
        msg: "Serverio klaida, mėginant redaguoti objekto įrašą DB"
      });
  }

  // fetch updated version
  try {
    const updated = db.prepare(`SELECT * FROM ${coll.name} WHERE id = ?`).get(draftId);
    return res.status(200).send({
      ok: 1,
      msg: `${coll.itemNames.Item}, kurio ID ${draftId}, sėkmingai pakeistas`,
      item: updated
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      ok: 0,
      reason: "server error",
      message:  `${coll.itemNames.Item}, kurio ID ${draftId}, buvo pakeistas, bet mėginant atsisiųsti atnaujintą įrašo versiją, įvyko duomenų bazės klaida. Siūloma atnaujinti įrašus programoje`,
      item: {...draft, id: draftId, regbit: req.user.regbit}
    });
  }
});

// @route PUT api/items/insert
// @desc Insert item
// @access Public
router.put("/insert", (req, res, next) => {
  const itype = req.body.itype || req.query.itype;
  const coll = COLLECTIONMAP.find(c => c.itype === itype);
  if (!coll) return res.status(404).send("no collection");

  // check if sufficient rights to update
  if (!coll.insertBy.includes(req.user.role)) {
    return res.status(400).send({
        case: "warning",
        message: `tu neturi teisės redaguoti ${coll.name} įrašų`
      });
  }

  // validate draft here
  const result = validate(req.body.draft, itype, false);
  if (result.hasErrors) {
    return res.status(200).send(result.errors);
  }
  
  let draft = result.item;    

  // check if there exist some record with the same place
  if (coll.samePlace) {
    let spFilter = " WHERE regbit = ?";
    spFilter += " AND " + coll.notPanaikinta;
    spFilter += " AND " + coll.samePlace;
    try {
      const spStmtText = "SELECT * FROM " + coll.name + spFilter;
      const samePlaceItem = db.prepare(spStmtText).get(draft, req.user.regbit);
      if (samePlaceItem) {
      return res.status(200).send({
          case: "warning",
          message: `${coll.itemNames.Item} nesukurtas - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceItem.id}`
        });
      }
    } catch (error) {
      console.log("same place error", error);
      return res.status(500).send(error);
    }    
  }

  // same place not found, so attempt to insert
  draft.regbit = req.user.regbit;
  draft.v = 0;
  if (COLLECTIONMAP.autoId) {
    delete draft.id;
  }

  try {
    const stmtText = SQLStatements.insert(draft, coll.name);
    const info = db.prepare(stmtText).run(draft);
    if (info.changes === 0) {
      return res.status(200).send({
        case: "warning",
        message: `${coll.itemNames.Item} nesukurtas dėl nežinomos priežasties`
      });
    }
    if (!draft.id) {
      draft.id = info.lastInsertRowid
    };
  } catch (error) {
    console.log("insert error", error)
    return res.status(500).send(error);
  }

  // fetch inserted version
  try {
    const inserted = db.prepare(`SELECT * FROM ${coll.name} WHERE id = ?`).get(draft.id);
    return res.status(200).send({
      case: "success",
      message: `${coll.itemNames.Item} sėkmingai sukurtas. Jo ID - ${inserted.id}`,
      data: inserted
    });
  } catch (error) {
    console.log("fetch inserted item error", error);
    return res.status(200).send({
      case: "warning",
      message:  `${coll.itemNames.Item}, kurio ID ${draft.id}, buvo sukurtas, bet mėginant atsisiųsti atnaujintą įrašo versiją, įvyko duomenų bazės klaida. Siūloma atnaujinti įrašus programoje`,
      data: {draft}
    });
  }
});

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete("/delete", (req, res, next) => {
  const itype = req.body.itype || req.query.itype;
  const coll = COLLECTIONMAP.find(c => c.itype === itype);
  if (!coll) return res.status(404).send("no collection");

  // check if sufficient rights to update
  if (!coll.deleteBy.includes(req.user.role)) {
    return res.status(400).send({
        case: "warning",
        message: `tu neturi teisės trinti ${coll.name} įrašų`
      });
  }

  const stmtText = `DELETE FROM ${coll.name} WHERE id = ? AND regbit = ? AND v = ?`;
  try {
    const info = db.prepare(stmtText).run(req.query.id, req.user.regbit, req.query.v);
    if (info.changes !== 1) {
      return res.status(200).send({
            case: "warning",
            message: `${coll.itemNames.Item} nebuvo pašalintas, nes toks id nerastas arba nesutampa versijos.`
          });
    } else {
      return res.status(200).send({
            case: "success",
            message: `${coll.itemNames.Item}, kurio id ${req.query.id}, pašalintas`
          }); 
    }
  } catch (error) {
    return res.status(500).send(error);
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
