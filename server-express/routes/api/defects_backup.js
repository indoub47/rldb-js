const express = require('express');
const router = express.Router();
const passport = require('passport');
const DefectModel = require('../../models/Defect');

const settings = require("../../config/settings");
const collections = settings.COLLECTIONS;
const dbName = settings.DB_NAME;
const dbUri = settings.DB_URI;

const MongoClient = require("mongodb").MongoClient;


router.use(passport.authenticate('jwt', { session: false }),);

// @route GET api/defects/version
// @desc Get defects version for particular region
// @access Public
router.get(
  '/version',  
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err); 
        const db = client.db(dbName);       
        const region = req.user.region;
        const collection = 'defects';
        const versionCollName = 'version';
        db.collection(versionCollName).findOne({}, (err, found) => {
          if (err) return res.status(500).send(err);
          return res.status(200).send({version: found[collection][region]});
        });
      });
  });

// @route GET api/defects
// @desc Get defects
// @access Public
router.get(
  '/',  
  (req, res) => {
    DefectModel
      .find({region: req.user.region}, (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
      });
  });

// @route POST api/defects/update
// @desc Update defect
// @access Public
router.post(
  '/update',
  (req, res) => {
    let draft = req.body.draft;
    const userRegion = req.user.region;

    const def_Id = draft._id;
    const defId = draft.id;
    delete draft._id; // remove _id so that it wouldn't be updated
    delete draft.id;
    delete draft.region;

    let operationResult;

    // check if defect's id is unique among same region defects
    /*
    DefectModel
      .findOne({id: defId, region: userRegion, _id: {$ne: def_Id}}, (err, found) => {
        if (err) return res.status(500).send(err);
        if (found) return res.status(400).send(`id ${defId} is not unique`);
        // attempt to update
        DefectModel.findOneAndUpdate({id: defId, region: userRegion}, {$set: draft}, {new: true}, (err, result) => {
          if (err) return res.status(500).send(err);
          if (!result) return res.status(401).send(`defect with id ${defId} not updated`);
          //return res.status(200).send(result);
          opResult = result;
        });
      });
    */

    const collDefects = db.collection("defects");
    const collVersions = db.collection("versions");

    // connect version 
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (connectError, client) => {
        if (connectError) return res.status(500).send(connectError); 
        const db = client.db(dbName);

        // check if defect's id is unique among same region defects
        collDefects("defects").findOne(
          {id: defId, region: userRegion, _id: {$ne: def_Id}}, 
          (checkUniqueError, found) => {
            if (checkUniqueError) return res.status(500).send(checkUniqueError);
            if (found) return res.status(400).send(`id ${defId} is not unique`);

            // attempt to update
            collDefects.findOneAndUpdate(
              {id: defId, region: userRegion}, // filter
              {$set: draft}, // update query
              {new: true}, // options
              (updateError, updateResult) => {
                if (updateError) {
                  return res.status(500).send(updateError);
                }
                if (!updateResult) {
                  return res.status(401).send(`defect with id ${defId} not updated`);
                }
                
                // update defects version
                collVersions.findOneAndUpdate(
                  {}, // filter
                  {}, // update query
                  {}, // options
                  (versionUpdateError, versionUpdateResult) => {
                    if (versionUpdateError) {
                      const responseObject = ;
                      return res.status(200).send({
                        operationResult: updateResult, 
                        versionError: versionUpdateError, 
                        version: null
                      });
                    }
                    return res.status(200).send({
                        operationResult: updateResult, 
                        versionError: null, 
                        version: found[collection][region]
                    });
                  });
              });
            });






        const region = req.user.region;
        const collection = 'defects';
        const versionCollName = 'version';
        db.collection(versionCollName).findOne({}, (err, found) => {
          if (err) return res.status(500).send(err);
          return res.status(200).send({version: found[collection][region]});
        });
      });
      
  });

// @route PUT api/defects/insert
// @desc Insert defect
// @access Public
router.put(
  '/insert',
  (req, res) => { 
    let draft = req.body.draft;
    const userRegion = req.user.region;
    delete draft._id;
    draft.region = userRegion;

    // check if defect's id is unique among same region defects
    DefectModel
      .findOne({id: draft.id, region: userRegion}, (err, found) => {
        if (err) return res.status(500).send(err);
        if (found) return res.status(400).send(`id ${draft.id} is not unique`);
        // attempt to insert
        DefectModel.create(draft, (err, result) => {
          if (err) return res.status(500).send(err);
          if (!result) return res.status(401).send(`defect was not created`);
          return res.status(200).send(result);
        });
    });
});

// @route DELETE api/defects/delete
// @desc Delete defect
// @access Public
router.delete(
  '/delete',
  (req, res) => { 
    //console.log("delete req.query.id, req.user.region", req.query.id, req.user.region);   
    DefectModel
      .findOneAndDelete({id: req.query.id, region: req.user.region}, (err, result) => {
        //console.log("result", result);
        if (err) {
          //console.log("delete error", err);
          return res.status(500).send(err);
        }

        if (result) {
          //console.log("delete result", result);
          return res.status(200).json({
            status: 200, 
            success: true, 
            msg: `id ${req.query.id} has been removed`, 
            defectId: req.query.id, 
            result
          });
        }

        //console.log("delete no result");
        return res.status(200).json({
          status: 200, 
          success: false, 
          msg: `id ${req.query.id} not found`
        });        
    });
});

module.exports = router;
