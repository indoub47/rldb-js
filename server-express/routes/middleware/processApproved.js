// validate item.journal,
// insert item.journal into itemj,
// ištrinti item iš supplied
const modifyExistingRecord = (
  item,
  itype,
  regbit,
  validate,
  ifExists,
  modifyRecord
) => {
  const vResult = validate(item.main, item.journal, itype, true, "journal");
  if (vResult.errors) {
    return false;
  }

  item.journal = vResult.item.journal;

  // check if exists
  // check if the same version
  // attempt to insert journal and delete from supplied
  try {
    const found = ifExists(item.main.id, regbit);
    if (!found || found.v !== item.main.v) {
      return false;
    }
    modifyRecord(item);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};


// validate item.main and item.journal,
// insert item.main into items,
// set item.journal.mainid,
// insert item.journal into itemj,
// ištrinti item iš supplied
const createNewRecord = (
  item,
  itype,
  regbit,
  validate,
  sammLocation,
  createRecord
) => {
  const vResult = validate(item.main, item.journal, itype, true, "both");
  if (vResult.errors) {
    return false;
  }

  item.main = vResult.item.main;
  item.journal = vResult.item.journal;

  // check for same location
  // if not same location - create record
  try {
    if (sameLocation(item.main, regbit)) {
      return false;
    }
    createRecord(item); // transaction
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {createNewRecord, modifyExistingRecord};