import itemSpecific from "./itemSpecific";

export const dropFields = (obj, itype) => {
  console.log("itype, itemSpecific", itype, itemSpecific);
  let newObj = {...obj};  
  itemSpecific[itype].fieldsToClear.forEach(f => {
    if (newObj[f]) newObj[f] = null;
  });
  return newObj;
};