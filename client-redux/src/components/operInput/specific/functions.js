const absent = val => val == null ? '' : val;
  
const pad = (num, size = 2) => {
  if (num == null || num === "") return "-".repeat(size);
  return ("0".repeat(size) + num).substr(-size);
}

const getDTString = timestamp =>
  new Date(timestamp).toLocaleString("lt-LT").slice(0, -3);

const getValidationString = validation => {
  let errs = "";
  if (validation.errors) {
    if (Array.isArray(validation.errors)) {
      errs = validation.errors.map(e => e.toString()).join(", ");
    } else {
      errs = validation.errors.toString();
    }        
    return `Validation: ${validation.reason}. Errors: ${errs}`;
  }
  return "Validation: " + validation.reason;
};

const getOperApar = item => `${absent(item.oper)}-${absent(item.apar)}`;

const getHL = item => `${absent(item.dh)}/${absent(item.dl)}`;

const getVietosKodas = item =>
  `${pad(item.linija)}.${absent(item.kelias)}${pad(item.km, 3)}.${pad(item.pk)}.${pad(item.m)}.${absent(item.siule)}`;

const getBegis = item => 
  `${absent(item.btipas)} ${absent(item.bgamykl)} ${absent(item.bmetai)}`;

export {getDTString, getValidationString, getOperApar, getHL, getVietosKodas, getBegis}