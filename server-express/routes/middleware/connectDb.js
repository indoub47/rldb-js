
const settings = require("../../config/settings");
const dbName = settings.DB_NAME;
const dbUri = settings.DB_URI;
const MongoClient = require("mongodb").MongoClient;


// connect database middleware
const connectDb = (req, res, next) => {
  MongoClient.connect(
    dbUri,
    {useNewUrlParser: true},
    (err, client) => {
      if (err) return res.status(500).send(err); 
      req.bnbldb = {};
      req.bnbldb.db = client.db(dbName);
      next();
    }
  );
};

module.exports = connectDb;