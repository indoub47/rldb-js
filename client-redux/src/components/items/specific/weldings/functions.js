const terminai = [
  { min: 30, max: 40 },
  { min: 244, max: 427 },
  { min: 730, max: 913 }
];

function addDays(dateStr, days) {
  var result = new Date(Date.parse(dateStr));
  result.setDate(result.getDate() + days);
  return result;
}

function minMax(data1, termin) {
  return {
    nuo: toShort(addDays(data1, termin.min)),
    iki: toShort(addDays(data1, termin.max))
  };
}

function nuoIki(weld) {
  if (weld.status == -1 || weld.data4) return { nuo: "", iki: "" };
  if (!weld.data2) return minMax(weld.data1, terminai[0]);
  if (!weld.data3) return minMax(weld.data1, terminai[1]);
  if (!weld.data4) return minMax(weld.data1, terminai[2]);
}

function toShort(d) {
  const mm = zerofill(d.getMonth() + 1, 2);
  const dd = zerofill(d.getDate(), 2);
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function zerofill(n, total) {
  return ("0000" + n).slice(-total);
}

export { nuoIki };
