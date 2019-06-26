// check if there exist some record with the same place
function checkSamePlace(main, action, msgUndone, res, req, db) {
  const coll = res.locals.coll;
  if (coll.samePlace) {
    const samePlaceFilter = `${coll.samePlace.filter[action]} AND ${coll.notPanaikinta} AND  ${coll.samePlace.query}`;
    try {
      const spStmtText = "SELECT * FROM " + coll.tables.main.name + samePlaceFilter;
      const samePlaceItem = db.prepare(spStmtText).get(main, req.user.regbit);
      if (samePlaceItem) {
        return res.status(400).send({
          ok: 0,
          reason: "bad draft",
          msg: `${coll.itemNames.Item} ${msgUndone} - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceItem.id}`
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: 0,
        reason: "server error",
        msg: `Serverio klaida, mėginant patikrinti, ar toje pačioje vietoje yra kitas ${coll.itemNames.item}`
      });
    }    
  }
  return "nosameplace";
} 

module.exports = checkSamePlace;
