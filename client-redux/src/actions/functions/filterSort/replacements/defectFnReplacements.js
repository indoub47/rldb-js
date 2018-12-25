/*
{
    "_id": {
        "$oid": "5b5db6b40f341b8113f09e7f"
    },
    "id": "6076",
    "region": "1",
    "vieta": {
        "meistrij": "11",
        "linst": "23",
        "kelias": "1",
        "km": 43,
        "pk": 2,
        "m": 42,
        "siule": "K"
    },
    "begis": {
        "tipas": "R65",
        "gamykla": "E",
        "metai": 2014
    },
    "kkateg": "2",
    "history": [
        {
            "data": "2016-11-03",
            "oper": "402",
            "apar": "829",
            "kodas": "27.4",
            "dh": 10,
            "dl": 5,
            "pavoj": "DP",
            "termin": "2016-11-08",
            "panaik": "2016-11-03"
        }
    ]
}
*/

export const filterReplacements = {
    id: 'x["id"]',
    region: 'x["region"]',

    meistrij: 'x.vieta["meistrij"]',
    linst: 'x.vieta["linst"]',
    kelias: 'x.vieta["kelias"]',
    iesmas: 'x.vieta["iesmas"]',
    km: 'x.vieta["km"]',
    pk: 'x.vieta["pk"]',
    m: 'x.vieta["m"]',
    siule: 'x.vieta["siule"]',

    tipas: 'x.begis["tipas"]',
    gamykla: 'x.begis["gamykla"]',
    metai: 'x.begis["metai"]',

    kkateg: 'x["kkateg"]',

    data: 'x.history[x.history.length - 1]["data"]',
    oper: 'x.history[x.history.length - 1]["oper"]',
    apar: 'x.history[x.history.length - 1]["apar"]',
    kodas: 'x.history[x.history.length - 1]["kodas"]',
    dh: 'x.history[x.history.length - 1]["dh"]',
    dl: 'x.history[x.history.length - 1]["dl"]',
    pavoj: 'x.history[x.history.length - 1]["pavoj"]',
    termin: 'x.history[x.history.length - 1]["termin"]',
    panaik: 'x.history[x.history.length - 1]["panaik"]',
    tvarsl: 'x.history[x.history.length - 1]["tvarsl"]',

    data_0: 'x.history[0]["data"]',
    oper_0: 'x.history[0]["oper"]',
    apar_0: 'x.history[0]["apar"]',
    kodas_0: 'x.history[0]["kodas"]',
    dh_0: 'x.history[0]["dh"]',
    dl_0: 'x.history[0]["dl"]',
    pavoj_0: 'x.history[0]["pavoj"]',
    termin_0: 'x.history[0]["termin"]',
    panaik_0: 'x.history[0]["panaik"]',
    tvarsl_0: 'x.history[0]["tvarsl"]'
  };

export function getSortingReplacement(fieldName, obj) {
  switch(fieldName) {
    case "id": return obj["id"];
    case "region": return obj["region"];

    case "meistrij": return obj.vieta["meistrij"];
    case "linst": return obj.vieta["linst"];
    case "kelias": return obj.vieta["kelias"];
    case "iesmas": return obj.vieta["iesmas"];
    case "km": return obj.vieta["km"];
    case "pk": return obj.vieta["pk"];
    case "m": return obj.vieta["m"];
    case "siule": return obj.vieta["siule"];

    case "tipas": return obj.begis["tipas"];
    case "gamykla": return obj.begis["gamykla"];
    case "metai": return obj.begis["metai"];

    case "kkateg": return obj["kkateg"];

    case "data": return obj.history[obj.history.length - 1]["data"];
    case "oper": return obj.history[obj.history.length - 1]["oper"];
    case "apar": return obj.history[obj.history.length - 1]["apar"];
    case "kodas": return obj.history[obj.history.length - 1]["kodas"];
    case "dh": return obj.history[obj.history.length - 1]["dh"];
    case "dl": return obj.history[obj.history.length - 1]["dl"];
    case "pavoj": return obj.history[obj.history.length - 1]["pavoj"];
    case "termin": return obj.history[obj.history.length - 1]["termin"];
    case "panaik": return obj.history[obj.history.length - 1]["panaik"];
    case "tvarsl": return obj.history[obj.history.length - 1]["tvarsl"];

    case "data_0": return obj.history[0]["data"];
    case "oper_0": return obj.history[0]["oper"];
    case "apar_0": return obj.history[0]["apar"];
    case "kodas_0": return obj.history[0]["kodas"];
    case "dh_0": return obj.history[0]["dh"];
    case "dl_0": return obj.history[0]["dl"];
    case "pavoj_0": return obj.history[0]["pavoj"];
    case "termin_0": return obj.history[0]["termin"];
    case "panaik_0": return obj.history[0]["panaik"];
    case "tvarsl_0": return obj.history[0]["tvarsl"];
    default: throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}