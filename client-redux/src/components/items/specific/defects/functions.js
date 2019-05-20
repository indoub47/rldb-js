function liko(defect) {
  if (!defect.dtermin || defect.daction) return "";
  return Math.floor((Date.parse(defect.dtermin) - Date.now())/86400000)
}

export {liko};