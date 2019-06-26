module.exports.main = {
  id: {type: 'integer'}, // insert - generates automatically, update - if wrong doesnt find
  regbit: {type: 'integer', required: true, validator: "isNegative"}, 
  linija: {type: 'string', required: true, validator: "isEmptyString"},
  kelias: {type: 'string', required: true, validator: "isEmptyString"},
  km: {type: 'integer', required: true, validator: "isNegative"},
  pk: {type: 'integer', required: true, validator: "isNegative"},
  m: {type: 'integer', required: true, validator: "isNegative"},
  siule: {type: 'string'},
  vbudas: {type: 'string', required: true, validator: "isEmptyString"},
  virino: {type: 'string', required: true, validator: "isEmptyString"},
  data0: {type: 'string', required: true, validator: "isNotShortDate"},
  status: {type: 'integer'},
  note: {type: 'string'},
};

module.exports.journal = {
  id: {},
  mainid: {},
  data1: {type: 'string', required: true, validator: "isNotShortDate"},
  oper1: {type: 'string', required: true, validator: "isEmptyString"},
  apar1: {type: 'string', required: true, validator: "isEmptyString"},
  defectid: {type: 'integer'}
}