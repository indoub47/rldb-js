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
            "action": "aptikta",
            "id": "jpserjwo",
            "data": "2016-11-03",
            "oper": "402",
            "apar": "829",
            "kodas": "27.4",
            "dh": 10,
            "dl": 5,
            "pavoj": "DP",
            "termin": "2018-12-12"
        },
        {
            "action": "panaik",
            "id": "asdfjqwe",
            "data": "2017-01-01"
        }
    ]
}
*/
const firstNonNbAction =
  'x.history.find(hi => hi.action !== "aptikta" && hi.action !== "perrasyta")';
const lastNbAction =
  'x.history[x.history.lastIndex(hi => hi.action === "aptikta" || hi.action === "perrasyta")]';
const lastNonNbAction =
  'x.history[x.history.lastIndex(hi => hi.action !== "aptikta" && hi.action !== "perrasyta")]';
const lastAction = "x.history[x.history.length - 1]";
const firstAction = "x.history[0]";
const inSomeAction = "hi";

export const filterReplacements = {
  id: "x.id",
  region: "x.region",

  meistrij: "x.vieta.meistrij",
  linst: "x.vieta.linst",
  kelias: "x.vieta.kelias",
  iesmas: "x.vieta.iesmas",
  km: "x.vieta.km",
  pk: "x.vieta.pk",
  m: "x.vieta.m",
  siule: "x.vieta.siule",

  tipas: "x.begis.tipas",
  gamykla: "x.begis.gamykla",
  metai: "x.begis.metai",

  kkateg: "x.kkateg",

  action_0: `${firstAction}.action`,
  data_0: `${firstAction}.data`,
  oper_0: `${firstAction}.oper`,
  apar_0: `${firstAction}.apar`,
  kodas_0: `${firstAction}.kodas`,
  dh_0: `${firstAction}.dh`,
  dl_0: `${firstAction}.dl`,
  pavoj_0: `${firstAction}.pavoj`,
  termin_0: `${firstAction}.termin`,

  action_ex0: `${firstNonNbAction}.action`,
  data_ex0: `${firstNonNbAction}.data`,
  // oper_ex0: `${firstNonNbAction}.oper`,
  // apar_ex0: `${firstNonNbAction}.apar`,
  // kodas_ex0: `${firstNonNbAction}.kodas`,
  // dh_ex0: `${firstNonNbAction}.dh`,
  // dl_ex0: `${firstNonNbAction}.dl`,
  // pavoj_ex0: `${firstNonNbAction}.pavoj`,
  // termin_ex0: `${firstNonNbAction}.termin`,

  // there is no non nb first action

  action_9: `${lastAction}.action`,
  data_9: `${lastAction}.data`,
  oper_9: `${lastAction}.oper`,
  apar_9: `${lastAction}.apar`,
  kodas_9: `${lastAction}.kodas`,
  dh_9: `${lastAction}.dh`,
  dl_9: `${lastAction}.dl`,
  pavoj_9: `${lastAction}.pavoj`,
  termin_9: `${lastAction}.termin`,


  action_op9: `${lastNbAction}.action`,
  data_op9: `${lastNbAction}.data`,
  oper_op9: `${lastNbAction}.oper`,
  apar_op9: `${lastNbAction}.apar`,
  kodas_op9: `${lastNbAction}.kodas`,
  dh_op9: `${lastNbAction}.dh`,
  dl_op9: `${lastNbAction}.dl`,
  pavoj_op9: `${lastNbAction}.pavoj`,
  termin_op9: `${lastNbAction}.termin`,

  action_ex9: `${lastNonNbAction}.action`,
  data_ex9: `${lastNonNbAction}.data`,
  // oper_ex9: `${lastNonNbAction}.oper`,
  // apar_ex9: `${lastNonNbAction}.apar`,
  // kodas_ex9: `${lastNonNbAction}.kodas`,
  // dh_ex9: `${lastNonNbAction}.dh`,
  // dl_ex9: `${lastNonNbAction}.dl`,
  // pavoj_ex9: `${lastNonNbAction}.pavoj`,
  // termin_ex9: `${lastNonNbAction}.termin`,

  action_x: `${inSomeAction}.action`,
  data_x: `${inSomeAction}.data`,
  oper_x: `${inSomeAction}.oper`,
  apar_x: `${inSomeAction}.apar`,
  kodas_x: `${inSomeAction}.kodas`,
  dh_x: `${inSomeAction}.dh`,
  dl_x: `${inSomeAction}.dl`,
  pavoj_x: `${inSomeAction}.pavoj`,
  termin_x: `${inSomeAction}.termin`,
};

const lastActionFunc = x => x.history[x.history.length - 1];
const firstActionFunc = x => x.history[0];
const firstNonNbActionFunc = x =>
  x.history.find(hi => hi.action !== "aptikta" && hi.action !== "perrasyta");
const lastNbActionFunc = x =>
  x.history[
    x.history.lastIndex(
      hi => hi.action === "aptikta" || hi.action === "perrasyta"
    )
  ];
const lastNonNbActionFunc = x =>
  x.history[
    x.history.lastIndex(
      hi => hi.action !== "aptikta" && hi.action !== "perrasyta"
    )
  ];

export function getSortingReplacement(fieldName, obj) {
  switch (fieldName) {
    // main
    case "id": return obj.id;
    case "region": return obj.region;
    case "kkateg": return obj.kkateg;

    // vieta
    case "meistrij": return obj.vieta.meistrij;
    case "linst": return obj.vieta.linst;
    case "kelias": return obj.vieta.kelias;
    case "iesmas": return obj.vieta.iesmas;
    case "km": return obj.vieta.km;
    case "pk": return obj.vieta.pk;
    case "m": return obj.vieta.m;
    case "siule": return obj.vieta.siule;

    // bėgis
    case "tipas": return obj.begis.tipas;
    case "gamykla": return obj.begis.gamykla;
    case "metai": return obj.begis.metai;

    // history
    case "action_0": return firstActionFunc(obj).action;
    case "data_0": return firstActionFunc(obj).data;
    case "oper_0": return firstActionFunc(obj).oper;
    case "apar_0": return firstActionFunc(obj).apar;
    case "kodas_0": return firstActionFunc(obj).kodas;
    case "dh_0": return firstActionFunc(obj).dh;
    case "dl_0": return firstActionFunc(obj).dl;
    case "pavoj_0": return firstActionFunc(obj).pavoj;
    case "termin_0": return firstActionFunc(obj).termin;

    case "action_ex0": return firstNonNbActionFunc(obj).action;
    case "data_ex0": return firstNonNbActionFunc(obj).data;
    // case "oper_ex0": return firstNonNbActionFunc(obj).oper;
    // case "apar_ex0": return firstNonNbActionFunc(obj).apar;
    // case "kodas_ex0": return firstNonNbActionFunc(obj).kodas;
    // case "dh_ex0": return firstNonNbActionFunc(obj).dh;
    // case "dl_ex0": return firstNonNbActionFunc(obj).dl;
    // case "pavoj_ex0": return firstNonNbActionFunc(obj).pavoj;
    // case "termin_ex0": return firstNonNbActionFunc(obj).termin;

    case "action_9": return lastActionFunc(obj).action;
    case "data_9": return lastActionFunc(obj).data;
    case "oper_9": return lastActionFunc(obj).oper;
    case "apar_9": return lastActionFunc(obj).apar;
    case "kodas_9": return lastActionFunc(obj).kodas;
    case "dh_9": return lastActionFunc(obj).dh;
    case "dl_9": return lastActionFunc(obj).dl;
    case "pavoj_9": return lastActionFunc(obj).pavoj;
    case "termin_9": return lastActionFunc(obj).termin;

    case "action_op9": return lastNbActionFunc(obj).action;
    case "data_op9": return lastNbActionFunc(obj).data;
    case "oper_op9": return lastNbActionFunc(obj).oper;
    case "apar_op9": return lastNbActionFunc(obj).apar;
    case "kodas_op9": return lastNbActionFunc(obj).kodas;
    case "dh_op9": return lastNbActionFunc(obj).dh;
    case "dl_op9": return lastNbActionFunc(obj).dl;
    case "pavoj_op9": return lastNbActionFunc(obj).pavoj;
    case "termin_op9": return lastNbActionFunc(obj).termin;

    case "action_ex9": return lastNonNbActionFunc(obj).action;
    case "data_ex9": return lastNonNbActionFunc(obj).data;
    // case "oper_ex9": return lastNonNbActionFunc(obj).oper;
    // case "apar_ex9": return lastNonNbActionFunc(obj).apar;
    // case "kodas_ex9": return lastNonNbActionFunc(obj).kodas;
    // case "dh_ex9": return lastNonNbActionFunc(obj).dh;
    // case "dl_ex9": return lastNonNbActionFunc(obj).dl;
    // case "pavoj_ex9": return lastNonNbActionFunc(obj).pavoj;
    // case "termin_ex9": return lastNonNbActionFunc(obj).termin;

    default:
      throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}
