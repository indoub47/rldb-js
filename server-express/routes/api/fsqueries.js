const express = require('express');
const router = express.Router();
const passport = require('passport');
const secret = require('../../config/secret');
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;
const ObjectId = require("mongodb").ObjectID;

const MongoClient = require('mongodb').MongoClient;

// force to authenticate
router.use(passport.authenticate('jwt', { session: false }));

// @route GET api/fsquery/fetch
// @desc Get fsqueries for particular itype and email
// @params itype string
// @access Public
router.get(
  '/fetch',
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        const filter = {email: req.user.email, itype: req.query.itype};
        const collName = 'fsqueries';
        client.db(dbName)
          .collection(collName)
          .find(filter)
          .toArray((err, result) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(result);
          });
      });
  });

// @route DELETE api/fsquery/delete
// @desc Delete fsquery
// @params id string
// @access Public
router.delete(
  '/delete',
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        const oid = ObjectId(req.query.id);
        const filter = {_id: oid, email: req.user.email};
        const collName = 'fsqueries';
        client.db(dbName)
          .collection(collName)
          .findOneAndDelete(
            filter,
            {projection: { _id: true }},
            (err, result) => {
              if (err) return res.status(500).send(err);
              return res.status(200).send({
                case: 'success',
                message: 'Užklausa sėkmingai pašalinta',
                data: result.value._id
              });
            });
      });
  });


// @route POST api/fsquery/update
// @desc Delete fsquery
// @body draft object
// @access Public
router.post(
  '/update',
  (req, res) => {
    MongoClient.connect(
      dbUri,
      {useNewUrlParser: true},
      (err, client) => {
        if (err) return res.status(500).send(err);
        let draft = req.body.draft;
        //let draft = JSON.parse(req.body.draft);
        const oid = ObjectId(draft._id);
        const email = req.user.email;
        draft.email = email;
        delete draft._id;
        const filter = {_id: oid, email: req.user.email};
        const collName = 'fsqueries';
        client.db(dbName)
          .collection(collName)
          .findOneAndUpdate(
            filter,
            {$set: draft}, // update query
            {
              returnNewDocument: true,
              new: true,
              returnOriginal: false
            }, // options
            (err, result) => {
              if (err) return res.status(500).send(err);
              return res.status(200).send({
                case: "success",
                message: `Užklausa, kurios ID ${draft.id}, sėkmingai pakeista`,
                data: result.value
              });
            });
      });
  });
  
// @route PUT api/fsquery/insert
// @desc Insert fsquery
// @body draft object
// @access Public
router.put('/insert', (req, res) => {
  MongoClient.connect(dbUri, {useNewUrlParser: true})
  .then(client => {
      let draft = req.body.draft;   
      //let draft = JSON.parse(req.body.draft);     
      draft.email = req.user.email;
      return client.db(dbName).collection('fsqueries').insertOne(draft)
  })
  .then(result => {
    return res.status(200).send({
              case: "success",
              message: `Užklausa sėkmingai įkišta`,
              data: result.ops[0]
            });
  })
  .catch(err => {
    return res.status(500).send(err);
  });
});


module.exports = router;