const express = require('express');
const router = express.Router();
const passport = require('passport');
//const DefectModel = require('../../models/Defect');
const areEqual = require('../../utilities/are-equal');

const settings = require("../../config/settings");
const collections = settings.COLLECTIONS;
const dbName = settings.DB_NAME;
const dbUri = settings.DB_URI;

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;


router.use(passport.authenticate('jwt', { session: false }),);


// connect database middleware
router.use((req, res, next) => {
  MongoClient.connect(
    dbUri,
    {useNewUrlParser: true},
    (err, client) => {
      if (err) return res.status(500).send(err); 
      req.bnbldb = {};
      req.bnbldb.db = client.db(dbName);
      next();
    }
  );
});

// @route GET api/defects/version
// @desc Get defects version for particular region
// @access Public
router.get(
  '/version',  
  (req, res) => {
    const region = req.user.region;
    const collection = 'defects';
    const versionCollName = 'version';
    req.bnbldb.db.collection(versionCollName).findOne(
      {}, 
      (err, found) => {
        if (err) return res.status(500).send(err);
        if (!found) return res.status(500).send({
          status: "500 Internal Server Error",
          message: `Server returned no version and without any reason`});
        return res.status(200).send({version: found[collection][region]});
    });
  });

// @route GET api/defects
// @desc Get defects
// @access Public
router.get(
  '/',  
  (req, res) => {
    req.bnbldb.db.collection("defects").find({region: req.user.region}).toArray( 
      (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
});

// @route POST api/defects/update
// @desc Update defect and increment version
// @access Public
router.post(
  '/update',
  (req, res, next) => {
    //console.log("update req.body.draft", req.body.draft);
    let draft = JSON.parse(req.body.draft);
    // validate draft here
    const valid = true
    if (!valid) {
      return res.status(400).send({
        status: "400 Bad Request",
        message: `Defect draft is invalid`,
        errors: {errormsg: "lots of errors"}
      });
    }

    const collDefects = req.bnbldb.db.collection("defects");
    
    const userRegion = req.user.region;
    const defId = draft.id;
    const def_Id = draft._id;
    const defV = draft.v;   
    // just check if still exists
    collDefects.findOne(
      {_id: def_Id},
      (findError, found) => {
        if(findError) {
          return res.status(500).send(findError);
        }
        if (!found) {
          return res.status(410).send({
            status: "410 Gone",
            message: `Defect id ${defId} has been deleted`
          });
        }

        // check if draft version doesn't equal db version
        if (defV !== found.v) {
          return res.status(409).send({
            status: "409 Conflict",
            message: `Defect id ${defId} has not been updated because it has been just modified by someone other`,
            found: found
          });
        }

        // check if both are Equal
        if (areEqual(draft, found)) {
          return res.status(304).send({
            status: "304 Not Modified",
            message: `There's no need to update - both objects are equal`
          });
        }

        // check if id is unique among its region defects
        collDefects.findOne(
          {id: defId, region: userRegion, _id: {$ne: def_Id}}, 
          (checkUniqueError, nonUniqueFound) => {
            if (checkUniqueError) {
              return res.status(500).send(checkUniqueError);
            }
            if (nonUniqueFound) {
              return res.status(400).send({
                status: "400 Bad Request",
                message: `id ${defId} is not unique`
              });
            }

            // update defect            
            delete draft._id; // remove _id so that it wouldn't be updated
            delete draft.id; // remove id so that it wouldn't be updated
            delete draft.region; // remove region so that it wouldn't be updated
            draft.v = draft.v + 1; // increment version
            collDefects.findOneAndUpdate(
              {_id: def_Id}, // filter
              {$set: draft}, // update query              
              {
                returnNewDocument: true,
                new: true,
                returnOriginal: false
              }, // options
              (updateError, updateResult) => {
                if (updateError) {
                  return res.status(500).send(updateError);
                }
                if (!updateResult) {
                  return res.status(500).send({
                    status: "500 Internal Server Error",
                    message: `Defect with id ${defId} hasn not been updated without any reason`
                  });
                }

                req.bnbldb.opResult = updateResult.value;
                req.bnbldb.userRegion = userRegion;
                req.bnbldb.collName = "defects";
                next();
            }); 
        });
    });      
});

// @route PUT api/defects/insert
// @desc Insert defect
// @access Public
router.put(
  '/insert',
  (req, res, next) => { 
    let draft = JSON.parse(req.body.draft);
    // validate draft here
    const userRegion = req.user.region;
    delete draft._id;
    draft.region = userRegion;
    draft.v = 0;

    const collDefects = req.bnbldb.db.collection("defects");
    // check if defect's id is unique among same region defects
    collDefects.findOne(
      {id: draft.id, region: userRegion}, 
      (idUniqueCheckError, idFound) => {
        if (idUniqueCheckError) {
          return res.status(500).send(idUniqueCheckError);
        }

        if (idFound) {
          return res.status(400).send({
            status: "400 Bad Request",
            message: `id ${draft.id} is not unique`
            });
        }
        
        // attempt to insert
        collDefects.insertOne(
          draft, 
          (insertErr, insertResult) => {
            if (insertErr) return res.status(500).send(insertErr);              
            if (!insertResult) return res.status(500).send({
                status: "500 Internal Server Error",
                message: `Defect hasn not been created for unknown reason`
              });
            
            req.bnbldb.opResult = insertResult.ops[0];
            req.bnbldb.userRegion = userRegion;
            req.bnbldb.collName = "defects";
            next();
        });
    });
});

// @route DELETE api/defects/delete
// @desc Delete defect
// @access Public
router.delete(
  '/delete',
  (req, res, next) => { 
    // connect
    const _id = ObjectId(req.query._id);
    const v = req.query.v;
    // validate _id and v
    // if invalid - code 400, message

    const collDefects = req.bnbldb.db.collection("defects");
    // find object
    collDefects.findOne(
      {_id},
      (findError, found) => {
        if (findError) {
          return res.status(500).send(findError);
        }

        if (!found) {
          return res.status(410).send({
            status: "410 Gone",
            message: `Defect id ${defId} has been deleted`
          });
        }

        // check version
        if (found.v && found.v != v) {
          return res.status(409).send({
            status: "409 Conflict",
            message: `Defect id ${defId} has not been deleted because it has been just modified by someone other`,
            found
          });
        }

        // delete attempt
        collDefects.findOneAndDelete(
          {_id},
          (deleteError, deleteResult) => {
            if (deleteError) {
              return res.status(500).send(deleteError);
            }

            if (!deleteResult) {
              if (!insertResult) return res.status(500).send({
                status: "500 Internal Server Error",
                message: `Defect hasn not been deleted for unknown reason`
              });
            }
            req.bnbldb.opResult = deleteResult.ok; // MAKE ID!
            req.bnbldb.userRegion = req.user.region;
            req.bnbldb.collName = "defects";
            next();
        });
    });
});


// increment collection version middleware
router.use((req, res) => {
  const {db, collName, opResult, userRegion} = req.bnbldb;
  // create increment operation dot notation object
  let incrementOp = {};
  incrementOp[collName + "." + userRegion] = 1;
  
  db.collection("versions").findOneAndUpdate(
    {}, // filter
    {$inc: incrementOp}, // update query
    {
      returnNewDocument: true,
      new: true,
      returnOriginal: false
    }, // options
    (error, result) => {
      if (error) {
        return res.status(200).send({
          result: opResult, 
          versionError: error, 
          version: null
        });
      }

      return res.status(200).send({
          result: opResult, 
          versionError: null, 
          version: result.value[collName][userRegion]
      });
  }); 
});

module.exports = router;
