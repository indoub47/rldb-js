module.exports = {
  id: {type: 'integer', label: "id"}, // insert - generates automatically, update - if wrong doesnt find
  v: {type: 'integer', label: "versija"}, // insert - generates automatically, update - if wrong doesnt update or updates the item which has been updated by someone other
  id1: {type: 'integer', validator: "isNegative", label: "ID1"},
  regbit: {type: 'integer', required: true, validator: "isNegative", label: "regiono bitas"},  
  meistrija: {type: 'string', required: true, validator: "isEmptyString", label: "meistrija"},
  linija: {type: 'string', required: true, validator: "isEmptyString", label: "linija"},
  kelias: {type: 'string', required: true, validator: "isEmptyString", label: "kelias"},
  km: {type: 'integer', required: true, validator: "isNegative", label: "km"},
  pk: {type: 'integer', required: true, validator: "isNegative", label: "pk"},
  m: {type: 'integer', required: true, validator: "isNegative", label: "m"},
  siule: {type: 'string', label: "siūlė"},
  kkateg: {type: 'string', required: true, validator: "isEmptyString", label: "kelio kategorija"},
  btipas: {type: 'string', required: true, validator: "isEmptyString", label: "bėgio tipas"},
  bgamykl: {type: 'string', required: true, validator: "isEmptyString", label: "bėgio gamykla"},
  bmetai: {type: 'integer', required: true, validator: "isNotYear", label: "bėgio pagaminimo metai"},
  dstop: {type: 'string', validator: "isNeitherEmptyStringNorShortDate", label: "pašalinimo data"},
  note: {type: 'string', validator: "wrongLength", params: {min: 0, max: 255}, label: "pastaba"},
};