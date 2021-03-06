const modelProvider = require("./models/modelProvider");
// parenka kaip konvertuoti duomens į tipą, kuris nurodytas model[prop].type
const converter = {
  string: { convert: value => value.toString().trim() },

  integer: {
    convert: (value, name) => {
      let int = parseInt(value);
      if (isNaN(int))
        throw { prop: name, msg: "value must be a non-negative integer" };
      return int;
    }
  },

  number: {
    convert: (value, name) => {
      let nr = Number(value);
      if (isNaN(nr))
        throw { prop: name, msg: "value must be a non-negative number" };
      return nr;
    }
  },
  
  boolean01: { convert: value => (parseInt(value) === 0 ? 0 : 1) }
};

// 
// draft laukus sukonvertuoja į tuos tipus, kurie nurodyti model[prop].type
// Jeigu konvertuoti nepavyksta, tą lauką įrašo į errors objektą
function normalize(draft, model, allErrors) {
  let result = {};
  let errors = {};
  const keysToSkip = Object.keys(allErrors);

  Object.keys(draft).forEach(key => {
    if (keysToSkip.includes(key)) {
      // jeigu šitam key jau yra rasta klaida, 
      // tiesiog perkopijuoja jo reikšmę į result
      result[key] = draft[key];
      return;
    }

    try {
      result[key] = converter[model[key].type].convert(draft[key], key);
    } catch (err) {
      result[key] = draft[key];
      errors[err.prop] = err.msg;
    }
  });
  return { item: result, normalizationErrors: errors };
}

// patikrina, ar data yra leistinose ribose - kad nebūtų, pvz. 2019-02-31
function hasDateOverflow(shortDateString) {
  const numbers = shortDateString.split("-").map(num => parseInt(num));
  const dt = new Date(shortDateString);
  return (
    numbers[0] !== dt.getFullYear() ||
    numbers[1] !== dt.getMonth() + 1 ||
    numbers[2] !== dt.getDate()
  );
}

// funkcijos, kurios atlieka tikrinimą, ir
// klaidos pranešimai, jeigu tikrinant gaunama true
const validators = {
  isAbsent: {
    func: value => value == null || value === "",
    msg: () => "is required"
  },

  isEmptyString: {
    func: value => value.length === 0,
    msg: () => "must be not empty"
  },

  wrongLength: {
    func: (value, params) =>
      value.length < params.min || value.length > params.max,
    msg: params => `length must be ${params.min}-${params.max} characters`
  },

  isNegative: {
    func: value => value < 0,
    msg: () => "must be not negative"
  },

  outOfLimits: {
    func: (value, params) => value < params.min || value > params.max,
    msg: params => `must be ${params.min}-${params.max} `
  },

  isNotYear: {
    func: value => value < 1900,
    msg: () => "must be a four-digit year"
  },

  isNotShortDate: {
    func: value => {
      return (
        !/^\d\d\d\d-\d\d-\d\d$/.test(value) ||
        isNaN(Date.parse(value)) ||
        hasDateOverflow(value)
      );
    },
    msg: () => "must be a valid date (yyyy-mm-dd)"
  },

  isNeitherEmptyStringNorShortDate: {
    func: value => {
      return (
        value.length > 0 &&
        (!/^\d\d\d\d-\d\d-\d\d$/.test(value) ||
          isNaN(Date.parse(value)) ||
          hasDateOverflow(value))
      );
    },
    msg: () => "must be a valid short date (yyyy-mm-dd) or empty"
  }
};

function requiredAbsent(draft, model) {
  let errors = {};
  Object.keys(model).filter(key => model[key].required).forEach(key => {
    if(validators.isAbsent.func(draft[key])) {
      errors[key] = validators.isAbsent.msg();
    }
  });
  return errors;
}

// Funkcija, kuri atlieka normalizavimą ir tikrinimą.
// Grąžina kiek įmanoma normalizuoto draft kopiją ir errors
function validate(draft, itype, insert = true) {
  const model = modelProvider[itype];
  if (!model) throw {msg: `Unrecognized item type ${itype}`};
  
  let allErrors = {};

  // randa tuos laukus, kurie yra required, bet jų reikšmė yra 
  // null, undefined arba ""
  if (insert) {
    allErrors = requiredAbsent(draft, model);
  } 
  
  // normalizuoja laukus - sukonvertuoja į tą tipą, koks reikalingas pagal model
  // laukų, kurie yra required ir neturi reikšmių nenormalizuoja
  let { item, normalizationErrors } = normalize(draft, model, allErrors);

  allErrors = {...allErrors, ...normalizationErrors};
  const keysWithErrors = Object.keys(allErrors);

  // likusius laukus tikrina ar teisingos jų reikšmės
  Object.keys(item)
    .filter(itemKey => !keysWithErrors.includes(itemKey))
    .forEach(prop => {
      if (!model[prop]) {
        delete item[prop];
        return;
      }
      if (!model[prop].validator) return;
      const validator = validators[model[prop].validator];
      const params = model[prop].params;
      if (validator.func(item[prop], params)) {
        allErrors[prop] = validator.msg(params);
      }
    });

  let errorsResult = {};
  Object.keys(allErrors).forEach(err => errorsResult[err] = {label: model[err].label, msg: allErrors[err]});

  return { item, errors: errorsResult, hasErrors: Object.keys(errorsResult).length > 0 };
}

module.exports = validate;
