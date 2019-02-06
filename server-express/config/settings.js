exports.COLLECTIONS = [
  {name: "defects", actions: []},
  {name: "weldings", actions: []},
  {name: "bgamykl", actions: ["defects", "all"]},
  {name: "btipas", actions: ["defects", "all"]},
  {name: "defskop", actions: ["defects", "all"]},
  {name: "operat", actions: ["defects", "all"]},
  {name: "tbudas", actions: ["defectoscopes", "all"]},
  {name: "kkateg", actions: ["defects", "all"]},
  {name: "linst", actions: ["defects", "all"]},
  {name: "action", actions: ["defects", "all"]},
  {name: "linija", actions: ["defects", "all"]},
  {name: "siule", actions: ["defects", "all"]},
  {name: "meistrij", actions: ["defects", "all"]},
  {name: "pavoj", actions: ["defects", "all"]},
  {name: "region", actions: ["register_user"]},
  {name: "urole", actions: ["register_user"]},
  {name: "ttype", actions: []},
  {name: "fsquery", actions: []},
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
