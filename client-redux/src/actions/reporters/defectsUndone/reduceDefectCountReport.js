export default function reduceDefectCountReport(report) {
  let things = {meistrija: [], kkateg: [], pavoj: []};
  let counts = [];

  for (var m = 0; m < report.length; m++) {
    let currentM = [];
    for (var kk = 0; kk < report[m].kkateg.length; kk++) {
      let currentKk = [];
      for (var p = 0; p < report[m].kkateg[kk].pavoj.length; p++) {
        currentP = report[m].kkateg[kk].pavoj[p];
        if (currentP.count > 0) {
          currentKk.push(currentP);
        }
      }
      if (currentKk.length > 0) {
        currentM.push(currentKk);
      }
    }
    if (currentM.length > 0) {
      counts.push(currentM);
    }
  }

  return {counts, things};
}