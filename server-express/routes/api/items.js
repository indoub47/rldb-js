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

// @route GET api/items
// @desc Get items
// @access Public
router.get(
  '/',  
  (req, res, next) => {
    req.bnbldb.collection.find(
      {region: req.user.region}
      ).toArray( 
      (err, result) => {
        if (err) { 
          return next(err);
        }
        return res.status(200).send(result);
    });
});

// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post(
  '/update',
  (req, res, next) => {
    let draft = JSON.parse(req.body.draft);
    // validate draft here
    const valid = true
    if (!valid) {
      return res.redirect('http://www.google.com');
    }

    const collection = req.bnbldb.collection;
    const itemName = req.bnbldb.item;
    
    const userRegion = req.user.region;
    const draftId = draft.id;
    const draft_Id = ObjectId(draft._id);
    const draftV = draft.v;   
    // just check if still exists
    collection.findOne(
      {_id: draft_Id},
      (findError, found) => {
        if(findError) {
          return next(findError);
        }
        if (!found) {            
          return next({
            status: 410, 
            message: `${itemName} with id ${draftId} has been deleted by someone else`
          });
        }  
        // check if draft version doesn't equal db version
        if (found.v !== draftV) {
          return next({
            status: 409, 
            message: `${itemName} with id ${draftId} has not been updated because it has been just modified by someone else`
          }); 
        }

        // check if both are Equal
        if (areEqual(draft, found)) {
          return next({
            status: 304,
            message: "There is no need to update - object has not been changed"
          });
        }
          
        // check if id is unique among its region items
        collection.findOne(
          {id: draftId, region: userRegion, _id: {$ne: draft_Id}}, 
          {}, // siunčiasi tik {_id: }, kad mažiau trafiko
          (checkUniqueError, nonUniqueFound) => {
            if (checkUniqueError) {
              return next(checkUniqueError);
            }
            if (nonUniqueFound) {
              return next({
                status:400, 
                message: `id ${draftId} is not unique`
              });
            }

            // update item           
            delete draft._id; // remove _id so that it wouldn't be updated
            delete draft.id; // remove id so that it wouldn't be updated
            delete draft.region; // remove region so that it wouldn't be updated
            draft.v = draft.v + 1; // increment version
            collection.findOneAndUpdate(
              {_id: draft_Id}, // filter
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
                    message: `${itemName} with id ${draftId} has not been updated without any reason`
                  });
                }

                return res.status(200).send(updateResult.value);
            }); 
        });
    });      
});

// @route PUT api/items/insert
// @desc Insert item
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

    // check if item's id is unique among same region items
    req.bnbldb.collection.findOne(
      {id: draft.id, region: userRegion},
      {},
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
        req.bnbldb.collection.insertOne(
          draft, 
          (insertErr, insertResult) => {
            if (insertErr) {
              return next(insertErr);
            }              
            if (!insertResult) {
              return next({
                status: 500,
                message: `${req.bnbldb.item} has not been created for unknown reason`
              });
            }

            return res.status(200).send(insertResult.ops[0]);
        });
    });
});

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete(
  '/delete',
  (req, res, next) => { 
    const oid = ObjectId(req.query._id);
    const v = req.query.v;
    // validate _id and v
    // if invalid - code 400, message

    const collection = req.bnbldb.collection;
    // find object
    req.bnbldb.collection.findOne(
      {_id: oid},
      {v: true, _id: false},
      (findError, found) => {
        if (findError) {
          return next(findError);
        }
        if (!found) {
          return next({
            status: 401,
            message: `${req.bnbldb.item} with _id ${oid} just has been deleted by someone else`
          });
        } 

        // check version
        if (found.v && found.v != v) {
          return next({
            status: 410,
            message: `${req.bnbldb.item} with _id ${oid} has not been deleted since it has been just modified by someone else`
          });
        }

        // delete attempt
        req.bnbldb.collection.findOneAndDelete(
          {_id: oid},
          {projection: {_id: true}},
          (deleteError, deleteResult) => {
            if (deleteError) {
              return next(deleteError);
            }
            if (!deleteResult) {
              return next({
                status: 500,
                message: `${req.bnbldb.item} has not been deleted for unknown reason`
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
