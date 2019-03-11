const express = require("express");
const router = express.Router();
const passport = require("passport");
const secret = require("../../config/secret");
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;

const MongoClient = require("mongodb").MongoClient;

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));


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
        // get info
        const collections = [
          "meistrija",
          "kkateg",
          "pavoj"
        ];
        const propObj = {};
        const propFilter = {
          $or: [{region: req.user.region}, {region: {$exists: false}}]
        };
        collections.forEach(c => {
          db.collection(c).find(propFilter, (err, found) => {
            if (err) return res.status(500).send(err); 
            found.toArray((err, result) => {
              if (err) return res.status(500).send(err);
              propObj[c] = result; 
              if (Object.keys(propObj).length === expected) {
                // got all info 
                // fetch the defects
                const filter = {
                  region: req.user.region,
                  $or: [
                    { panaikinta: null },
                    { panaikinta: 0 },
                    { panaikinta: "" },
                    { panaikinta: false },
                    { panaikinta: "0000-00-00" }
                  ]
                };
                // additional filter if it's looking for overdued
                if (req.query.items === "overdue") {
                  const byDate = req.query.bydate || (new Date()).toISOString().split('T')[0];
                  filter["$and"] = [
                    {dtermin: {$ne: null}},
                    {dtermin: {$gt: byDate}}
                  ];
                }
                db.collection("defects")
                  .find(filter)
                  .toArray((err, defects) => {
                    if (err) return res.status(500).send(err);
                    // perform grouping
                    // 1. create grouping superarray:
                    const grouped = {};
                    propObj["meistrija"].forEach(m => {
                      propObj["pavoj"].forEach(p => {
                        propObj["kkateg"].forEach(kk ={
                          grouped[m][p][kk] = [];
                        });
                      });
                    });
                    // 2. increase object counts
                    // reikėtų sukišti į try-catch tam atvejui, jeigu
                    // būtų nežinoma meistrija, pavoj arba kk
                    defects.forEach(d => {
                      grouped[d.meistrija][d.pavoj][d.kkateg].push(d);
                    });
                    return res.status(200).send(result);
                  });





              }        
            });
        });




        const filter = {$or: [{region: req.user.region}, {region: {$exists: false}}]};
        const collNames = collections.filter(c => c.actions.includes("defects")).map(c => c.name); 
        const expected = collNames.length;
        collNames.forEach(c => {
          db.collection(c).find(filter, (err, found) => {
            if (err) return res.status(500).send(err); 
            found.toArray((err, result) => {
              if (err) return res.status(500).send(err);
              propObj[c] = result; 
              
              if (Object.keys(resultObject).length === expected) {
                return res.status(200).json(resultObject);
              } 
                    
            });
          });          
        });  
      });
  });
