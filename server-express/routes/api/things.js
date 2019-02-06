const express = require("express");
const router = express.Router();
const passport = require("passport");
const settings = require("../../config/settings");
const secret = require("../../config/secret");
const collections = settings.COLLECTIONS;
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;

const MongoClient = require("mongodb").MongoClient;

// @route GET api/things/register
// @desc Get register things as one object
// @access Public

router.get(
  "/register",
  (req, res) => {
    var resultObject = {};    
    const registerCollections = collections.filter(c => c.actions.includes("register_user")).map(c => c.name);
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err); 
        const db = client.db(dbName);
        const expected = registerCollections.length;
        registerCollections.forEach(c => {
          db.collection(c).find({}, (err, found) => {
            if (err) return res.status(500).send(err); 
            found.toArray((err, result) => {
              if (err) return res.status(500).send(err);
              resultObject[c] = result; 
              if (Object.keys(resultObject).length === expected) {
                return res.status(200).json(resultObject);
              }        
            });
          });          
        });  
      });
  });

router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/things
// @desc Get things
// @access Public
router.get(
  "/",
  (req, res, next) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        const filter = {$or: [{region: req.user.region}, {region: {$exists: false}}]};
        const collName = collections.find(c => c.name === req.query.ttype).name;
        client.db(dbName)
          .collection(collName)
          .find(filter)
          .toArray((err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).json(result);
          });
      });
  });

// @route GET api/things/defects
// @desc Get all things for defects app as one object
// @access Public
router.get(
  "/defects",
  (req, res) => {
    var resultObject = {};
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err); 
        const db = client.db(dbName);       
        const filter = {$or: [{region: req.user.region}, {region: {$exists: false}}]};
        const collNames = collections.filter(c => c.actions.includes("defects")).map(c => c.name); 
        const expected = collNames.length;
        collNames.forEach(c => {
          db.collection(c).find(filter, (err, found) => {
            if (err) return res.status(500).send(err); 
            found.toArray((err, result) => {
              if (err) return res.status(500).send(err);
              resultObject[c] = result; 
              
              if (Object.keys(resultObject).length === expected) {
                return res.status(200).json(resultObject);
              } 
                    
            });
          });          
        });  
      });
  });


// @route GET api/things/fs/:itype
// @desc Get filter-sort queries for itype for particular region
// @access Public
router.get(
  "/fs/:itype",
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err); 
        const db = client.db(dbName);
        const filter = {
          region: req.user.region, 
          itype: req.params.itype
        };
        const collName = 'fsqueries';
        db.collection(collName)
          .find(filter)
          .toArray((err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(result);
          });
    }); 
});


// @route GET api/things/fs/welding
// @desc Get filter-sort queries for welding for particular region
// @access Public
router.get(
  "/fs/welding",
  (req, res) => {
    var resultObject = {};
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err); 
        const db = client.db(dbName);       
        const filter = {region: req.user.region};
        //const projection = {_id: 0, region: 0};
        const collName = 'querydefect';
        db.collection(collName).find(filter, (err, found) => {
          if (err) return res.status(500).send(err); 
          found.toArray((err, result) => {
            if (err) return res.status(500).send(err);            
            return res.status(200).json(result[0].queries);
          });
        }); 
      });
  });


// @route POST api/things/fs/defect/update
// @desc Update defect filter-sort (replace by draft) query packet
// @access Public
router.post(
  "/fs/defect/update",
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        const filter = {region: req.user.region};
        const setCommand = {$set: {defect: req.body.queries}};
        const options = {
            returnNewDocument: true,
            new: true,
            returnOriginal: false
          }; // options
        const collectionName = 'fsqueries';
        client.db(dbName).collection(collectionName)
          .findOneAndUpdate(filter, setCommand, options, (err, result) => {
            if (err) return res.status(500).send(err);
            console.log("result", result);
            return res.status(200).json(result.value.defect);
        });
    });
  });

// @route GET api/things/all
// @desc Get all things for all apps as one object
// @access Public
router.get(
  "/all",
  (req, res) => {
    var resultObject = {};
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err); 
        const db = client.db(dbName);       
        const filter = {$or: [{region: req.user.region}, {region: {$exists: false}}]};
        const collNames = collections.filter(c => c.actions.includes("all")).map(c => c.name); 
        const expected = collNames.length;
        collNames.forEach(c => {
          db.collection(c).find(filter, (err, found) => {
            if (err) return res.status(500).send(err); 
            found.toArray((err, result) => {
              if (err) return res.status(500).send(err);
              resultObject[c] = result; 
              
              if (Object.keys(resultObject).length === expected) {
                return res.status(200).json(resultObject);
              } 
                    
            });
          });          
        });  
      });
  });

// @route POST api/things/update
// @desc Update things (replace by draft)
// @access Public
router.post(
  "/update",
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        const draft = req.body.draft;
        draft.region = req.user.region;
        const filter = {region: req.user.region, id: req.body.id};
        const collName = collections.find(c => c.name === req.body.ttype).name;
        // delete non-updateable fields;
        delete draft._id;
        delete draft.id;
        client.db(dbName).collection(collName)
          .findOneAndUpdate(filter, {$set: draft}, {returnOriginal: false}, (err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(result.value);
        });
    });
  });

// @route PUT api/things/insert
// @desc Create thing
// @access Public
router.put(
  "/create",
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        const collName = collections.find(c => c.name === req.body.ttype).name;
        const collection = client.db(dbName).collection(collName);
        let draft = req.body.draft;

        // check if such id exists        
        const filter = {region: req.user.region, id: req.body.id};
        collection.findOne(filter, (err, thing) => {
          // if error
          if (err) return res.status(500).send(err);
          // if id exists
          if (thing) return res.status(401).json({success: false, msg: "id must be unique"});
          // if doesn't exist
          draft.region = req.user.region;
          collection.insertOne(draft, (err, result) => {
            // if error
            if (err) return res.status(500).send(err);
            // if inserted
            draft._id = result.insertedId;
            return res.status(200).json({success: true, thing: draft});
          });
        });
    });
});

// @route DELETE api/things/delete
// @desc Delete thing
// @access Public
router.delete(
  "/delete",
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);               
        const filter = {region: req.user.region, id: req.body.id};
        const collName = collections.find(c => c.name === req.body.ttype).name;
        client.db(dbName).collection(collName)
          .deleteOne(filter, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.deletedCount < 1) {
              return res.status(200).json({status: 200, success: false, msg: "item was not found", value: deletedCount});
            }
            return res.status(200).json({status: 200, success: true, msg: "item was deleted", value: deletedCount});
          });
    });
});

module.exports = router;
