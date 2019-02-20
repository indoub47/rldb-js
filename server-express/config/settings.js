exports.COLLECTIONS = [
  {name: "defects", actions: []},
  {name: "weldings", actions: []},
  {name: "bgamykl", actions: ["all"]},
  {name: "btipas", actions: ["all"]},
  {name: "defskop", actions: ["all"]},
  {name: "operat", actions: ["all"]},
  {name: "tbudas", actions: ["defectoscopes", "all"]},
  {name: "kkateg", actions: ["all"]},
  {name: "linst", actions: ["all"]},
  {name: "action", actions: ["all"]},
  {name: "linija", actions: ["all"]},
  {name: "siule", actions: ["all"]},
  {name: "meistrija", actions: ["all"]},
  {name: "pavoj", actions: ["all"]},
  {name: "region", actions: ["register_user"]},
  {name: "urole", actions: ["register_user"]},
  {name: "ttype", actions: []},
  {name: "fsqueries", actions: []},
  {name: "user", actions: []}
];

exports.COLLECTION_MAP = [
  {itype: "defect", 
    name: "defects", 
    itemNames: {
      item: "defektas", 
      Item: "Defektas"
    }
  },
  {itype: "welding", 
    name: "weldings", 
    itemNames: {
      item: "suvirinimas", 
      Item: "Suvirinimas"
    }
  }
];

// developement
exports.ERROR_PCT = 25.0;
exports.RANDOM_ERROR_ON = false;
exports.DELAY_RANGE = [250, 2000];
exports.SHOULD_DELAY = true;
