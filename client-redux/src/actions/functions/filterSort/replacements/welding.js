export const filterReplacements = {
  id: "x.id",
  region: "x.region",
  linija: "x.linija",
  kelias: "x.kelias",
  km: "x.km",
  pk: "x.pk",
  m: "x.m",
  siule: "x.siule",
  virino: "x.virino",
  vbudas: "x.vbudas",
  data1: "x.data1",
  apar1: "x.apar1",
  oper1: "x.oper1",
  data2: "x.data2",
  apar2: "x.apar2",
  oper2: "x.oper2",
  data3: "x.data3",
  apar3: "x.apar3",
  oper3: "x.oper3",
  data4: "x.data4",
  apar4: "x.apar4",
  oper4: "x.oper4",
  panaikinta: "x.panaikinta",
  pastaba: "x.pastaba",
  vt: "x.km && x.pk && (x.km*1000+(x.pk-1)*100+x.m)"
};

export function getSortingReplacement(fieldName, obj) {
  switch (fieldName) {
    case "id": return obj.id;
    case "region": return obj.region;
    case "linija": return obj.linija;
    case "kelias": return obj.kelias;
    case "km": return obj.km;
    case "pk": return obj.pk;
    case "m": return obj.m;
    case "siule": return obj.siule;
    case "virino": return obj.virino;
    case "vbudas": return obj.vbudas;
    case "data1": return obj.data1;
    case "apar1": return obj.apar1;
    case "oper1": return obj.oper1;
    case "data2": return obj.data2;
    case "apar2": return obj.apar2;
    case "oper2": return obj.oper2;
    case "data3": return obj.data3;
    case "apar3": return obj.apar3;
    case "oper3": return obj.oper3;
    case "data4": return obj.data4;
    case "apar4": return obj.apar4;
    case "oper4": return obj.oper4;
    case "panaikinta": return obj.panaikinta;
    case "pastaba": return obj.pastaba;

    default:
      throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}
