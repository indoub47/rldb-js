const settings = require("../../config/settings");
const dbName = settings.DB_NAME;
const dbUri = settings.DB_URI;
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
        req.bnbldb.db = client.db(dbName);
        return next();
      }
    }
  );
};

module.exports = connectDb;
