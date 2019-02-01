const secret = require("../../config/secret");
const dbName = secret.DB_NAME;
const dbUri = secret.DB_URI;
const urlCollectionMap = require("../../config/settings").URL_COLLECTION_MAP;
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
        //console.log("baseUrl", req.baseUrl);
        const urlCollection = urlCollectionMap.find(uc => uc.url === req.baseUrl);
        if (!urlCollection) return res.status(404).end();
        req.bnbldb.collection = client.db(dbName).collection(urlCollection.collection);
        req.bnbldb.item = urlCollection.item;
        return next();
      }
    }
  );
};

module.exports = connectDb;
