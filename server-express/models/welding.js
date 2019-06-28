module.exports.main = {
  id: {type: 'integer', label: "id"}, // insert - generates 
  oldid: {type: 'integer', label: "oldid"}, // insert - generates automatically, update - if wrong doesnt find
  v: {type: 'integer', label: "versija"}, // insert - generates 
  regbit: {type: 'integer', validator: "isNegative", label: "regiono bitas"}, // is set by the server 
  linija: {type: 'string', required: true, validator: "isEmptyString", label: "linija"},
  kelias: {type: 'string', required: true, validator: "isEmptyString", label: "kelias"},
  km: {type: 'integer', required: true, validator: "isNegative", label: "km"},
  pk: {type: 'integer', required: true, validator: "isNegative", label: "pk"},
  m: {type: 'integer', required: true, validator: "isNegative", label: "m"},
  siule: {type: 'string', label: "siūlė"},
  vbudas: {type: 'string', required: true, validator: "isEmptyString", label: "virinimo būdas"},
  virino: {type: 'string', required: true, validator: "isEmptyString", label: "kas virino"},
  dt0: {type: 'string', required: true, validator: "isNotShortDate", label: "virinimo data"},
  dstop: {type: 'integer', required: true, validator: "isNegative", label: "statusas"},
  note: {type: 'string', validator: "wrongLength", params: {min: 0, max: 255}, label: "pastaba"},
  suvnr: {type: 'string', label: "suvnr"},
  nrschema: {type: 'string', label: "nrschema"}
};

module.exports.journal = {
  id: {type: 'integer', required: true, validator: "isNegative", label: "id"},
  dt: {type: 'string', required: true, validator: "isNotShortDate", label: "įrašo data"},
  oper: {type: 'string', required: true, validator: "isEmptyString", label: "operatoriaus kodas"},
  apar: {type: 'string', required: true, validator: "isEmptyString", label: "defektoskopo kodas"},
  pvd: {type: 'string', validator: "wrongLength", params: {min: 1, max: 50}, label: "pavadinimas"},
  note: {type: 'string', validator: "wrongLength", params: {min: 0, max: 255}, label: "pastaba"},
  defectid: {type: 'integer', validator: "isNegative", label: "defekto ID"},
  mainid: {type: 'integer', label: 'main id'}
}