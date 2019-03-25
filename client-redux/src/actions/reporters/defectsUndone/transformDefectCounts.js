import createDefectCountGroups from "./createDefectCountGroups";

export default function transformDefectCounts(defectCounts, things) {
  // sukuria meistrijų, kkateg'ų, pavojų grupes
  const groups = createDefectCountGroups(things);

  // skirta išfiltruoti konkrečias meistrijas, kategorijas ir pavojingumus
  // atitinkančius defectCount'us
  const fitFunction = (meistrijaIds, kkategIds, pavojIds) => {
    return defectCount => meistrijaIds.includes(defectCount._id.meistrija) &&
      kkategIds.includes(defectCount._id.kkateg) && 
      pavojIds.includes(defectCount._id.pavoj);
  }

  // susumuoja count iš defectCountų masyvo
  const sumReducer = (accumulator, currentValue) => accumulator + currentValue.count;

  // pagal meistrijų, kkateg'ų ir pavojų ids išfiltruoja tinkančius defectCountus ir 
  // susumuoja jų count property values
  const sumCounts = (defectCounts, meistrijaIds, kkategIds, pavojIds) =>
    defectCounts.filter(fitFunction(meistrijaIds, kkategIds, pavojIds)).reduce(sumReducer, 0);

  return groups.meistrija.map(m => ({...m, kkateg: groups.kkateg.map(kk => ({...kk, pavoj: groups.pavoj.map(p => ({...p, count: sumCounts(defectCounts, m.ids, kk.ids, p.ids)}))}))}));
  
}