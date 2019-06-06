module.exports = {
  id: {type: 'integer', required: true, validator: "isNegative", label: "id"},
  daptik: {type: 'string', required: true, validator: "isNotShortDate", label: "įrašo data"},
  action: {type: 'integer', validator: "outOfLimits", params: {min: 0, max: 2}, label: "veiksmas"},
  kodas: {type: 'string', required: true, validator: "isEmptyString", label: "defekto kodas"},
  dl: {type: 'number', validator: "isNegative", label: "defekto dydis L"},
  dh: {type: 'number', validator: "isNegative", label: "defekto dydis H"},
  pavoj: {type: 'string', required: true, validator: "isEmptyString", label: "pavojingumo laipsnis"},
  oper: {type: 'string', required: true, validator: "isEmptyString", label: "operatoriaus kodas"},
  apar: {type: 'string', required: true, validator: "isEmptyString", label: "defektoskopo kodas"},
  dtermin: {type: 'string', validator: "isNeitherEmptyStringNorShortDate", label: "pašalinimo terminas"},
  note: {type: 'string', validator: "wrongLength", params: {min: 0, max: 255}, label: "pastaba"},
};