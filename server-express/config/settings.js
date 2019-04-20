exports.COLLECTIONS = [
  {name: "defects", actions: [], autoId: true},
  {name: "weldings", actions: [], autoId: true},
  {name: "bgamykl", actions: ["all"], hasRegion: false, autoId: false},
  {name: "btipas", actions: ["all"], hasRegion: false, autoId: false},
  {name: "defskop", actions: ["all"], hasRegion: true, autoId: false},
  {name: "operat", actions: ["all"], hasRegion: true, autoId: false},
  {name: "tbudas", actions: ["defectoscopes", "all"], hasRegion: false, autoId: false},
  {name: "kkateg", actions: ["all"], hasRegion: false, autoId: false},
  {name: "linst", actions: ["all"], hasRegion: true, autoId: false},
  {name: "linija", actions: ["all"], hasRegion: true, autoId: false},
  {name: "siule", actions: ["all"], hasRegion: false, autoId: false},
  {name: "meistrija", actions: ["all"], hasRegion: true, autoId: false},
  {name: "pavoj", actions: ["all"], hasRegion: false, autoId: false},
  {name: "region", actions: ["register_user"]},
  {name: "urole", actions: ["register_user"]},
  {name: "ttype", actions: []},
  {name: "fsqueries", actions: [], hasRegion: false, autoId: true},
  {name: "users", actions: []}
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
  },
  {itype: "employee", 
    name: "operat", 
    itemNames: {
      item: "darbuotojas", 
      Item: "Darbuotojas"
    }
  }
];

// developement
exports.ERROR_PCT = 25.0;
exports.RANDOM_ERROR_ON = false;
exports.DELAY_RANGE = [250, 2000];
exports.SHOULD_DELAY = true;
