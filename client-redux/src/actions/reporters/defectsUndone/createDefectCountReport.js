import createDefectCountGroups from "./createDefectCountGroups";

export default function createDefectCountReport(things, filteredDefects) {
  
  const groups = createDefectCountGroups(things);

  const fitFunction = (meistrijaIds, kkategIds, pavojIds) => {
    return defect => meistrijaIds.includes(defect.meistrija) &&
      kkategIds.includes(defect.kkateg) && 
      pavojIds.includes(defect.pavoj);
  }

  return groups.meistrija.map(m => ({...m, kkateg: groups.kkateg.map(kk => ({...kk, pavoj: groups.pavoj.map(p => ({...p, count: filteredDefects.filter(fitFunction(m.ids, kk.ids, p.ids).length)}))}))}));
}
