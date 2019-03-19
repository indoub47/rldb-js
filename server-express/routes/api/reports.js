const express = require("express");
const router = express.Router();
const passport = require("passport");
const secret = require("../../config/secret");
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;

const MongoClient = require("mongodb").MongoClient;

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));


// @route GET api/report/defects-undone
// @desc Get all defefects which are still on the road
// @access Public
router.get("/defects-undone", (req, res) => {
  var resultObject = {};
  // connect mongo
  MongoClient.connect(dbUri, {useNewUrlParser: true}, (err, client) => {
    if (err) return res.status(500).send(err); 
    const db = client.db(dbName);
    // for defect grouping required info
    const collections = [
      "meistrija",
      "kkateg",
      "pavoj"
    ];
    let propObj = {};
    const propFilter = {
      $or: [{region: req.user.region}, {region: {$exists: false}}]
    };
    // collect for defect grouping required info
    collections.forEach(c => {
      db.collection(c).find(propFilter, (err, found) => {
        if (err) return res.status(500).send(err); 
        found.toArray((err, result) => {
          if (err) return res.status(500).send(err);
          propObj[c] = result;
          // if all grouping props fetched... 
          if (Object.keys(propObj).length === collections.length) {            
            // defect filter
            const defectFilter = {
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
            if (req.query.overdued) {
              // if bydate hasn't been passed, looks overdued by today
              const byDate = req.query.bydate || (new Date()).toISOString().split('T')[0];
              defectFilter["$and"] = [
                {dtermin: {$ne: null}},
                {dtermin: {$lt: byDate}}
              ];
            }
            // fetching defects
            db.collection("defects").find(defectFilter, (err, foundDefects) => {
              if (err) return res.status(500).send(err);
              foundDefects.toArray((err, defects) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send({things: propObj, defects});
              });
            });
          }        
        });
      });
    });
  });
});


// @route GET api/report/defects-undone-count
// @desc Get all defefects which are still on the road
// @access Public
router.get("/defects-undone-count", (req, res) => {
  var resultObject = {};
  // connect mongo
  MongoClient.connect(dbUri, {useNewUrlParser: true}, (err, client) => {
    if (err) return res.status(500).send(err); 
    const db = client.db(dbName);
    // for defect grouping required info
    const collections = [
      "meistrija",
      "kkateg",
      "pavoj"
    ];
    let propObj = {};
    const propFilter = {
      $or: [{region: req.user.region}, {region: {$exists: false}}]
    };
    // collect for defect grouping required info
    collections.forEach(c => {
      db.collection(c).find(propFilter, (err, found) => {
        if (err) return res.status(500).send(err); 
        found.toArray((err, result) => {
          if (err) return res.status(500).send(err);
          propObj[c] = result;
          // if all grouping props fetched... 
          if (Object.keys(propObj).length === collections.length) {            
            // defect filter
            const defectFilter = {
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
            if (req.query.overdued) {
              // if bydate hasn't been passed, looks overdued by today
              const byDate = req.query.bydate || (new Date()).toISOString().split('T')[0];
              defectFilter["$and"] = [
                {dtermin: {$ne: null}},
                {dtermin: {$lt: byDate}}
              ];
            }
            // fetching defects
            db.collection("defects").find(defectFilter, (err, foundDefects) => {
              if (err) return res.status(500).send(err);
              foundDefects.toArray((err, defects) => {
                if (err) return res.status(500).send(err);
                let counted = [];
                propObj["meistrija"].forEach(m => {
                  propObj["pavoj"].forEach(p => {
                    propObj["kkateg"].forEach(kk => {
                      let count = defects.filter(d => 
                          d.meistrija === m.id && 
                          d.pavoj === p.id && 
                          d.kkateg === kk.id
                        ).length;
                      if (count > 0) {
                      counted.push({
                        meistrija: m.id,
                        pavoj: p.id,
                        kkateg: kk.id,
                        count
                      });
                      }
                    });
                  });
                });
                return res.status(200).send(counted);
              });
            });
          }        
        });
      });
    });
  });
});

module.exports = router;