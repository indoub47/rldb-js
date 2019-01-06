// increment collection version middleware
export const incrementCollectionVersion = (req, res) => {
  const {db, collName, opResult, userRegion} = req.bnbldb;
  // create increment operation dot notation object
  let incrementOp = {};
  incrementOp[collName + "." + userRegion] = 1;
  
  db.collection("versions").findOneAndUpdate(
    {}, // filter
    {$inc: incrementOp}, // update query
    {
      returnNewDocument: true,
      new: true,
      returnOriginal: false
    }, // options
    (error, result) => {
      if (error) {
        return res.status(200).send({
          result: opResult, 
          versionError: error, 
          version: null
        });
      }

      return res.status(200).send({
          result: opResult, 
          versionError: null, 
          version: result.value[collName][userRegion]
      });
  }); 
};