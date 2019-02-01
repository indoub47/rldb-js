const express = require("express");
const router = express.Router();
const passport = require("passport");
const areEqual = require("../../utilities/are-equal");
const connectDb = require("../middleware/connectDb");
const ObjectId = require("mongodb").ObjectID;
const getId = require("../../utilities/getId");
const getSamePlaceFilter = require("../../utilities/samePlace");

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// connect database middleware
router.use(connectDb);

// @route GET api/items
// @desc Get nepanaikinti items
// @access Public
router.get("/", (req, res, next) => {
  req.bnbldb.collection
    .find({
      region: req.user.region,
      $or: [
        { panaikinta: null },
        { panaikinta: 0 },
        { panaikinta: "" },
        { panaikinta: false },
        { panaikinta: "0000-00-00" }
      ]
    })
    .toArray((err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(result);
    });
});

// @route GET api/items/all
// @desc Get all items
// @access Public
router.get("/all", (req, res, next) => {
  req.bnbldb.collection
    .find({ region: req.user.region })
    .toArray((err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(result);
    });
});

// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post("/update", (req, res, next) => {
  //let draft = JSON.parse(req.body.draft);
  let draft = req.body.draft;

  // validate draft here
  const valid = true;
  if (!valid) {
    return res.redirect("http://www.google.com");
  }

  const collection = req.bnbldb.collection;
  const itemType = req.bnbldb.item;

  const userRegion = req.user.region;
  const draftId = draft.id;
  const draft_Id = ObjectId(draft._id);
  const draftV = draft.v;
  // just check if still exists
  collection.findOne(
    { _id: draft_Id, region: userRegion },
    (findError, found) => {
      if (findError) {
        return next(findError);
      }
      if (!found) {
        return res.status(200).send({
          case: "warning",
          message: `Nepakeistas - ${itemType}, kurio id ${draftId}, buvo ką tik ištrintas kažkieno kito`
        });
      }
      // check if draft version doesn't equal db version
      if (found.v !== draftV) {
        return res.status(200).send({
          case: "warning",
          message: `Nepakeistas - ${itemType}, kurio id ${draftId}, buvo ką tik redaguotas kažkieno kito`
        });
      }

      // check if both are Equal
      if (areEqual(draft, found)) {
        return res.status(200).send({
          case: "warning",
          message: `Nepakeistas, nėra reikalo atnaujinti - ${itemType} toks pat kaip ir serveryje`
        });
      }

      // check if there exist some record with the same place
      let samePlaceFilter = getSamePlaceFilter(draft, userRegion);
      samePlaceFilter._id = { $ne: draft_Id };
      //console.log("samePlaceFilter", samePlaceFilter);
      req.bnbldb.collection.findOne(
        samePlaceFilter,
        (samePlaceCheckError, samePlaceFound) => {
          if (samePlaceCheckError) {
            return next(samePlaceCheckError);
          }
          if (samePlaceFound) {
            return res.status(200).send({
              case: "warning",
              message: `Nepakeistas - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceFound.id}`
            });
          }
          // same place not found
          // update item
          delete draft._id; // remove _id so that it wouldn't be updated
          delete draft.id; // remove id so that it wouldn't be updated
          delete draft.region; // remove region so that it wouldn't be updated
          draft.v = draft.v + 1; // increment version
          collection.findOneAndUpdate(
            { _id: draft_Id, region: userRegion }, // filter
            { $set: draft }, // update query
            {
              returnNewDocument: true,
              new: true,
              returnOriginal: false
            }, // options
            (updateError, updateResult) => {
              if (updateError) {
                return next(updateError);
              }
              if (!updateResult) {
                return next({
                  message: `Nepakeistas - ${itemType}, kurio id ${draftId}, nepakeistas dėl nežinomos priežasties`
                });
              }

              return res.status(200).send({
                case: "success",
                message: `${itemType}, kurio id ${draftId}, sėkmingai pakeistas`,
                data: updateResult.value
              });
            }
          );
        }
      );
    }
  );
});

// @route PUT api/items/insert
// @desc Insert item
// @access Public
router.put("/insert", (req, res, next) => {
  //let draft = JSON.parse(req.body.draft);
  // validate draft here
  const userRegion = req.user.region;
  const itemType = req.bnbldb.item;
  let samePlaceFilter = getSamePlaceFilter(draft);
  //console.log("samePlaceFilter", samePlaceFilter);

  // check if same place
  req.bnbldb.collection.findOne(
    samePlaceFilter,
    (samePlaceCheckError, samePlaceFound) => {
      if (samePlaceCheckError) {
        return next(samePlaceCheckError);
      }
      if (samePlaceFound) {
        return res.status(200).send({
          case: "warning",
          message: `Nesukurtas - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceFound.id}`
        });
      }

      // samePlace not found, so attempt to insert
      delete draft._id;
      draft.region = userRegion;
      draft.v = 0;
      draft.id = getId(); // must be checked if unique

      req.bnbldb.collection.insertOne(draft, (insertErr, insertResult) => {
        if (insertErr) {
          return next(insertErr);
        }
        if (!insertResult) {
          return next({
            message: `${itemType} nesukurtas dėl nežinomos priežasties`
          });
        }

        return res.status(200).send({
          case: "success",
          message: `${itemType} sėkmingai sukurtas. Jo ID: ${draft.id}`,
          data: insertResult.ops[0]
        });
      });
    }
  );
});

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete("/delete", (req, res, next) => {
  //console.log(req);
  const oid = ObjectId(req.query._id);
  const userRegion = req.user.region;
  const itemType = req.bnbldb.item;
  const v = req.query.v;
  console.log("oid, v", oid, v);
  // validate _id and v
  // if invalid - code 400, message

  const collection = req.bnbldb.collection;
  // find object
  req.bnbldb.collection.findOne(
    { _id: oid, region: userRegion },
    (findError, found) => {
      if (findError) {
        return next(findError);
      }
      if (!found) {
        return res.status(200).send({
            case: "warning",
            message: `${itemType} jau buvo pašalintas`
          });
      }

      // check version
      console.log("check version: v, found.v", v, found.v);
      if (found.hasOwnProperty("v") && parseInt(found.v) !== parseInt(v)) {
        return res.status(200).send({
          case: "warning",
          message: `Neištrintas, nes ${itemType}, kurio ID ${found.id}, ką tik buvo redaguotas kažkieno kito`
        });
      }

      // delete attempt
      req.bnbldb.collection.findOneAndDelete(
        { _id: oid, region: userRegion },
        { projection: { _id: true } },
        (deleteError, deleteResult) => {
          if (deleteError) {
            return next(deleteError);
          }
          if (!deleteResult.value) {
            return next({
              message: `${itemType} neištrintas dėl nežinomos priežasties`
            });
          }
          //console.log("deleteResult", deleteResult);
          return res.status(200).send({
            case: "success",
            message: `${itemType} sėkmingai pašalintas`,
            data: deleteResult.value._id
          });
        }
      );
    }
  );
});

// error handler
router.use((err, req, res, next) => {
  if (!err.status) {
    console.error(err);
  }
  return res.status(err.status || 500).send(err);
});

module.exports = router;
