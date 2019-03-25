const express = require("express");
const router = express.Router();
const passport = require("passport");
const secret = require("../../config/secret");
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;

const MongoClient = require("mongodb").MongoClient;

const getDate = queryDate => queryDate || (new Date()).toISOString().split('T')[0];
const dateIsEmpty = dateProp => ([
    { [dateProp]: null },
    { [dateProp]: 0 },
    { [dateProp]: "" },
    { [dateProp]: false },
    { [dateProp]: "0000-00-00" }
  ]);

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route GET api/report/defects-undone
// @desc Get all defefects which are still on the road
// @access Public
router.get("/defects-undone", (req, res) => {
  // connect mongo
  MongoClient.connect(dbUri, {useNewUrlParser: true})
  .then(client => {
    return client.db(dbName);
  })
  .then(db => {
    const byDate = getDate(req.query.bydate);

    let defectsFilter = {
      region: req.user.region,
      daptik: {$lte: byDate},
      $or: [
        {$or: dateIsEmpty("panaikinta")},
        {panaikinta: {$gt: byDate}}
      ]
    };

    if (req.query.meistrijos) {
      defectsFilter["meistrija"] = {$in: req.query.meistrijos};
    }

    if (req.query.overdued) {
      defectsFilter["$not"] =  {$or: dateIsEmpty("dtermin")};
      defectsFilter["dtermin"] = {$lte: byDate};
    }
    const thingsFilter = {
      $or: [{region: req.user.region}, {region: {$exists: false}}]
    };

    return Promise.all([
      db.collection("meistrija").find(thingsFilter),
      db.collection("kkateg").find(thingsFilter),
      db.collection("pavoj").find(thingsFilter),
      db.collection("defects").find(defectsFilter)
    ]);
  })
  .then(cursors => Promise.all(cursors.map(c => c.toArray())))
  .then(arrays => res.status(200).send({
    things: {
      meistrija: arrays[0],
      kkateg: arrays[1],
      pavoj: arrays[2]
    }, 
    defects: arrays[3]
  }))
  .catch(err => {
    console.log("error", err);
    return res.status(500).send(err);
  });
});

// @route GET api/report/defects-undone-count
// @desc counts of all defefects which are still on the road, grouped by meistrija, kkateg, pavoj
// @access Public
router.get("/defects-undone-count", (req, res) => { 
  // connect mongo
  MongoClient.connect(dbUri, {useNewUrlParser: true})
  .then(client => client.db(dbName))
  .then(db => {
    // thing  filter
    const thingsFilter = {
      $or: [{region: req.user.region}, {region: {$exists: false}}]
    };

    // defect filter
    const byDate = getDate(req.query.bydate);
    let defectsFilter = {
      region: req.user.region,
      daptik: {$lte: byDate},
      $or: [
        {$or: dateIsEmpty("panaikinta")},
        {panaikinta: {$gt: byDate}}
      ]
    };

    if (req.query.meistrijos) {
      defectsFilter["meistrija"] = {$in: req.query.meistrijos};
    }

    if (req.query.overdued) {
      defectsFilter["$not"] =  {$or: dateIsEmpty("dtermin")};
      defectsFilter["dtermin"] = {$lte: byDate};
    }

    // defect grouping
    const defectsGroup = {
      _id: {meistrija: "$meistrija", pavoj: "$pavoj", kkateg: "$kkateg"},
      count: { $sum: 1 }
    };

    return Promise.all([
      db.collection("meistrija").find(thingsFilter),
      db.collection("kkateg").find(thingsFilter),
      db.collection("pavoj").find(thingsFilter),
      db.collection("defects").aggregate([
        {$match: defectsFilter},
        {$group: defectsGroup}
      ])
    ]);
  })
  .then(cursors => Promise.all(cursors.map(c => c.toArray())))  
  .then(arrays => res.status(200).send({
    things: {
      meistrija: arrays[0],
      kkateg: arrays[1],
      pavoj: arrays[2]
    }, 
    counts: arrays[3]
  })).catch(err => {
    console.log("error", err);
    return res.status(500).send(err);
  });
});

// @route GET api/report/k33
// @desc creates a k33 report for a period
// @access Public
router.get("/k33", (req, res) => { 
  // connect mongo
  MongoClient.connect(dbUri, {useNewUrlParser: true})
  .then(client => client.db(dbName))
  .then(db => {
    // thing  filter
    const startDate = getDate(req.query.startDate);
    const endDate = getDate(req.query.endDate);
    // patikrinti ar datos
    if (startDate > endDate) throw {message: "Periodo pradžios data negali būti vėlesnė už periodo pabaigos datą"};

    const operatFilter = {
      $and: [
        {$or: [
          {region: req.user.region}, 
          {region: {$exists: false}}
        ]},
        {started: {$lte: endDate}}, 
        {$or: [
          ...dateIsEmpty("stopped"),
          {stopped: {$gte: startDate}} 
        ]}             
      ]
    };

    const defskopFilter = {
      $and: [
        {$or: [
          {region: req.user.region}, 
          {region: {$exists: false}}
        ]},
        {started: {$lte: endDate}}, 
        {$or: [
          ...dateIsEmpty("stopped"),
          {stopped: {$gte: startDate}} 
        ]}             
      ]
    };

    const pavojFilter = {
      $or: [
        {region: req.user.region}, 
        {region: {$exists: false}}
      ]
    };

    const vbudasFilter = {
      $or: [
        {region: req.user.region}, 
        {region: {$exists: false}}
      ]
    };

    const defectFilter = {
      region: req.user.region,
      $and: [
        {daptik: {$gte: startDate}},
        {daptik: {$lte: endDate}}
      ],
    }

    const weldingFilter = {
      region: req.user.region,
      $or: [
        {$and: [
          {$not: {$or: dateIsEmpty("date1")}},
          {date1: {$gte: startDate}},
          {date1: {$lte: endDate}}
        ]},
        {$and: [
          {$not: {$or: dateIsEmpty("date2")}},
          {date2: {$gte: startDate}},
          {date2: {$lte: endDate}}
        ]},
        {$and: [
          {$not: {$or: dateIsEmpty("date3")}},
          {date3: {$gte: startDate}},
          {date3: {$lte: endDate}}
        ]},
        {$and: [
          {$not: {$or: dateIsEmpty("date4")}},
          {date4: {$gte: startDate}},
          {date4: {$lte: endDate}}
        ]}
      ]
    }
    
    // defect grouping
    const defectGrouping = {
      _id: {meistrija: "$operat", pavoj: "$defskop", kkateg: "$pavoj"},
      count: { $sum: 1 }
    };

    // welding grouping
    const weldingGrouping = {
      _id: {meistrija: "$operat", pavoj: "$defskop", kkateg: "$vbudas"},
      count: { $sum: 1 }
    };

    return Promise.all([
      db.collection("operat").find(operatFilter),
      db.collection("defskop").find(defskopFilter),
      db.collection("pavoj").find(pavojFilter),
      db.collection("vbudas").find(vbudasFilter),
      db.collection("defects").aggregate([
        {$match: defectFilter},
        {$group: defectGrouping}
      ]),
      db.collection("weldings").aggregate([
        {$match: weldingFilter},
        {$group: weldingGrouping}
      ])
    ]);
  })
  .then(cursors => Promise.all(cursors.map(c => c.toArray())))  
  .then(arrays => res.status(200).send({
    things: {
      operat: arrays[0],
      defskop: arrays[1],
      pavoj: arrays[2],
      vbudas: arrays[3]
    }, 
    counts: {
      defect: arrays[4],
      welding: arrays[5]
    } 
  })).catch(err => {
    console.log("error", err);
    return res.status(500).send(err);
  });
});

module.exports = router;