export default function createDefectCountGroups(things) {
  const kkateg = [
      { label: "1", ind: 1, ids: ["1"] },
      { label: "2", ind: 2, ids: ["2"] },
      { label: "3, 4", ind: 3, ids: ["3", "4"] },
      { label: "kt.", ind: 4, ids: ["5", "6", "7"] }
    ];

  const meistrija = things.meistrija
      .map(m => ({ label: m.abbr, ind: m.ind, ids: [m.id] }))
      .sort((a, b) => a.ind - b.ind);

  const pavoj = things.pavoj
      .filter(p => p.id !== "L")
      .map(p => ({ label: p.id, ind: p.ind, ids: [p.id] }))
      .sort((a, b) => b.ind - a.ind);
      
  return {meistrija, pavoj, kkateg}  
}