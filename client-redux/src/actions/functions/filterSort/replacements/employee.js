const today = (new Date()).toISOString().split('T')[0]

export const filterReplacements = {
  id: "x.id",
  region: "x.region",
  name: "x.name",
  atest: "x.atest",
  yraAtestuotas: "x.atest && x.atest >= " + today 
};

export function getSortingReplacement(fieldName, x) {
  switch (fieldName) {
    case "id": return x.id;
    case "region": return x.region;
    case "name": return x.name;
    case "atest": return x.atest;

    default:
      throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}
