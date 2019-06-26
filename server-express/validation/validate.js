const modelProvider = require("../models/modelProvider");
// parenka kaip konvertuoti duomens į tipą, kuris nurodytas model[prop].type
const converter = {
  string: { convert: value => value.toString().trim() },

  integer: {
    convert: value => {
      let int = parseInt(value);
      if (isNaN(int))
        throw { msg: "value must be an integer" };
      return int;
    }
  },

  number: {
    convert: value => {
      let nr = Number(value);
      if (isNaN(nr))
        throw { name, msg: "value must be a number" };
      return nr;
    }
  }
};

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

function emptyValue(val) {
  return (
    val == null || 
    (typeof val === 'string' && val.trim() === '')
  );
}

function validateProp(key, draft, model, insert) {
  // Garantuotai model turi šitą key.
  // Jeigu insert, tai key yra iš model.
  // Jeigu update, tai key yra iš draft.

  // patikrina ar prop/prop reikšmė yra apskritai
  // jeigu insert, tai required prop reikšmė yra privaloma
  if (model[key].required) { // jeigu privalomas
    if ( // draft neturi (kai insert) arba turi tuščią (ir insert, ir update)
      (!draft.hasOwnProperty(key) && insert) ||
      (draft.hasOwnProperty(key) && emptyValue(draft[key]))
    ) {
      return {error: "is required"};
    }
  } else { // jeigu nėra privalomas
    if (!draft.hasOwnProperty(key)) { // ir jeigu draft neturi
      return null;
    }
  }

  // mėgina konvertuoti
  // grąžina prop arba error
  let value;
  try {
    value = converter[model[key].type].convert(draft[key]);
  } catch (err) { 
    return {error: err.msg};
  }

  // tikrina pagal modelyje nurodytą validatorių
  // jeigu validatorius nenurodytas - netikrina
  //console.log("key, model.key", key, model[key]);
  if (model[key].validator) {
    const validator = validators[model[key].validator];
    const params = model[key].params;
    if (validator.func(value, params)) {
      return  {error: validator.msg(params)};
    }
  }

  return {value};
}

function validateObject(draft, model, insert) {
  let errors = [];
  let normalized = {};
  // Kai insert - visi required laukai turi būti drafte.
  // Kai update - required laukas negali būti paverstas tuščiu.
  // Jeigu insert - tikrinama pagal model. Čia tam, kad būtų patikrinti
  // visi privalomi laukai - ar jie yra drafte.
  // Jeigu update - tikrinama pagal draft.
  const keys = insert ? Object.keys(model) : Object.keys(draft);
  keys.forEach(key => {
    if (!model[key]) return; // išmetami tie laukai, kurių nėra modelyje
    const result = validateProp(key, draft, model, insert);
    if (result) {
      if (result.error) {
        errors.push({key, id: draft.id, msg: result.error});
        return;
      }
      normalized[key] = result.value;
    }
  });
  
  if (errors.length) return {errors};
  return {draft: normalized};
}

function validate(main, journal, itype, insert) {
  let allErrors = [];
  let resultItem = {
    main: null,
    journal: {
      insert: [],
      update: [],
      delete: journal.delete
    }
  };
  let result;
  const mainModel = modelProvider[itype].main;
  const journalModel = modelProvider[itype].journal;

  result = validateObject(main, mainModel, insert);
  if (result.errors) {
    allErrors = result.errors;
  } else {
    resultItem.main = result.draft;
  }
  

  journal.insert && journal.insert.forEach(journalItem => {
    result = validateObject(journalItem, journalModel, true);    
    if (result.errors) {
      allErrors = allErrors.concat(result.errors);
    } else {
      resultItem.journal.insert.push(result.draft);
    }
  });

  journal.update && journal.update.forEach(journalItem => {
    result = validateObject(journalItem, journalModel, insert);   
    if (result.errors) {
      allErrors = allErrors.concat(result.errors);
    } else {
      resultItem.journal.update.push(result.draft);
    }
  });
  
  if (allErrors.length) return {errors: allErrors};
  return {item: resultItem};  
}




module.exports = validate;
