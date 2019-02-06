const secret = require("../../config/secret");
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;
const collectionMap = require("../../config/settings").COLLECTION_MAP;
const MongoClient = require("mongodb").MongoClient;

// connect database middleware
const connectDb = (req, res, next) => {
  MongoClient.connect(
    dbUri,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) {
        next(err);
      } else {
        req.bnbldb = {};
        const itype = req.body.itype || req.query.itype;
        if (!itype) return res.status(404).send("no itype");
        const coll = collectionMap.find(c => c.itype === itype);
        if (!coll) return res.status(404).send("no collection");
        req.bnbldb.collection = client.db(dbName).collection(coll.name);
        req.bnbldb.names = coll.itemNames;
        return next();
      }
    }
  );
};

module.exports = connectDb;
