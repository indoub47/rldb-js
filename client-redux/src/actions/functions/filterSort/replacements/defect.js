export const filterReplacements = {
  id: "x.id",
  id1: "x.id1",
  regbit: "x.regbit",
  meistrija: "x.meistrija",
  linija: "x.linija",
  kelias: "x.kelias",
  km: "x.km",
  pk: "x.pk",
  m: "x.m",
  siule: "x.siule",
  kodas: "x.kodas",
  dh: "x.dh",
  dl: "x.dl",
  pavoj: "x.pavoj",
  btipas: "x.btipas",
  bgamykla: "x.bgamykla",
  bmetai: "x.bmetai",
  kkateg: "x.kkateg",
  oper: "x.oper",
  apar: "x.apar",
  daptik: "x.daptik",
  dtermin: "x.dtermin",
  daction: "x.daction",
  liko: "(x.dtermin && !x.daction) && Math.floor((Date.parse(x.dtermin)-Date.now())/86400000)",
  vt: "(x.kelias && (x.kelias==='1' || x.kelias==='2') && x.km && x.pk && (x.m || x.m===0)) && (x.km*1000+(x.pk-1)*100+x.m)"
};

export function getSortingReplacement(fieldName, x) {
  switch (fieldName) {
    case "id": return x.id;
    case "id1": return x.id1;
    case "regbit": return x.regbit;
    case "kkateg": return x.kkateg;
    case "meistrija": return x.meistrija;
    case "linija": return x.linija;
    case "kelias": return x.kelias;
    case "km": return x.km;
    case "pk": return x.pk;
    case "m": return x.m;
    case "siule": return x.siule;
    case "apar": return x.apar;
    case "oper": return x.oper;
    case "kodas": return x.kodas;
    case "dh": return x.dh;
    case "dl": return x.dl;
    case "pavoj": return x.pavoj;
    case "btipas": return x.btipas;
    case "bgamykla": return x.bgamykla;
    case "bmetai": return x.bmetai;
    case "daptik": return x.daptik;
    case "dtermin": return x.dtermin;
    case "daction": return x.daction;
    case "liko": return x.dtermin && !x.daction ? Math.floor((Date.parse(x.dtermin)-Date.now())/86400000) : Number.MAX_SAFE_INTEGER;

    default:
      throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}
