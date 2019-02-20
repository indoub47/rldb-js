function liko(defect) {
  if (defect.panaikinta || defect.dtvarsl || !defect.dtermin) return "";
  return Math.floor((Date.parse(defect.dtermin) - Date.now())/86400000)
}

export {liko};