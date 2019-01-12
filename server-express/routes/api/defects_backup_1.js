const express = require('express');
const router = express.Router();
const passport = require('passport');
const areEqual = require('../../utilities/are-equal');
const connectDb = require("../middleware/connectDb");
const ObjectId = require("mongodb").ObjectID;

// force to authenticate
router.use(passport.authenticate('jwt', { session: false }),);

// connect database middleware
router.use(connectDb);

// @route GET api/defects
// @desc Get defects
// @access Public
router.get(
  '/',  
  (req, res, next) => {
    req.bnbldb.db.collection("defects").find({region: req.user.region}).toArray( 
      (err, result) => {
        if (err) { 
          return next(err);
        }
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
      return res.redirect('http://www.google.com');
    }
    const collDefects = req.bnbldb.db.collection("defects");
    
    const userRegion = req.user.region;
    const defId = draft.id;
    const def_Id = ObjectId(draft._id);
    const defV = draft.v;   
    // just check if still exists
    collDefects.findOne(
      {_id: def_Id},
      (findError, found) => {
        if(findError) {
          return next(findError);
        }
        if (!found) {            
          return next({
            status: 410, 
            message: `Defect with id ${defId} has been deleted by someone else`
          });
        }  
        // check if draft version doesn't equal db version
        if (defV !== found.v) {
          return next({
            status: 409, 
            message: `Defect with id ${defId} has not been updated because it has been just modified by someone else`
          }); 
        }

        // check if both are Equal
        if (areEqual(draft, found)) {
          return next({
            status: 304,
            message: "There is no need to update - object has not been changed"
          });
        }
          console.log("are not equal", draft, found);

        // check if id is unique among its region defects
        collDefects.findOne(
          {id: defId, region: userRegion, _id: {$ne: def_Id}}, 
          (checkUniqueError, nonUniqueFound) => {
            if (checkUniqueError) {
              return next(checkUniqueError);
            }
            if (nonUniqueFound) {
              return next({
                status:400, 
                message: `id ${draft.id} is not unique`
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
                  return next(updateError);
                }
                if (!updateResult) {
                  return next({
                    status: 500, 
                    message: `Defect with id ${defId} has not been updated without any reason`
                  });
                }

                return res.status(200).send(updateResult.value);
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
          return next(idUniqueCheckError);
        }

        if (idFound) {
          return next({
            status: 400,
            message: `id ${draft.id} is not unique`
          });
        }
        
        // attempt to insert
        collDefects.insertOne(
          draft, 
          (insertErr, insertResult) => {
            if (insertErr) {
              return next(insertErr);
            }              
            if (!insertResult) {
              return next({
                status: 500,
                message: "Defect has not been created for unknown reason"
              });
            }

            return res.status(200).send(insertResult.ops[0]);
        });
    });
});

// @route DELETE api/defects/delete
// @desc Delete defect
// @access Public
router.delete(
  '/delete',
  (req, res, next) => { 
    console.log("/delete");
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
          return next(findError);
        }
        if (!found) {
          return next({
            status: 401,
            message: `Defect _id ${_id} just has been deleted by someone else`
          });
        } 

        // check version
        if (found.v && found.v != v) {
          return next({
            status: 410,
            message: `Defect _id ${_id} has not been deleted since it has been just modified by someone else`
          });
        }

        // delete attempt
        collDefects.findOneAndDelete(
          {_id},
          {projection: {_id: true}},
          (deleteError, deleteResult) => {
            if (deleteError) {
              return next(deleteError);
            }
            if (!deleteResult) {
              return next({
                status: 500,
                message: "Defect has not been deleted for unknown reason"
              });
            }

            return res.status(200).send(deleteResult.value._id);
        });
    });
});

// error handler
router.use((err, req, res, next) => {
  if (!err.status) {    
    console.error(err); 
  } 
  return res.status(err.status || 500).send({message: err.message}); 
});

module.exports = router;
