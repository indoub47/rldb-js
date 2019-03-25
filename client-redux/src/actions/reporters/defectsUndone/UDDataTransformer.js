export default class UDDataTransformer {
  data;
  byDate;
  whichDefects;
  local;

  constructor(data, params) {
    // data and params come from reportActions
    this.byDate = params.bydate || new Date().toISOString().split("T")[0];
    this.whichDefects = params.whichDefects; // active, overdued, both
    this.local = params.local ? true : false;  
    this.data = data;
  }


  // kol kas su 'both' nedarysiu nieko
  createFilter() {
    if (this.whichDefects === 'active') {
      return this.activeFilter();
    } else if (this.whichDefects === 'overdued') {
      return this.activeAndOverduedFilter();
    } else {
      throw new Error(`Filter ${this.whichDefects} is not implemented yet`);
    }
  }

  // iš turimų data išfiltruoja visus defektus, kurie yra kelyje
  // ir tik tuos defektus, kurie yra reikalingose meistrijose
  activeFilter() {
    return defect => (defect.daptik <= this.byDate &&
      (this.dateIsEmpty(defect.panaikinta) || defect.panaikinta > this.byDate));
  }

  // laikoma, kad esantys kelyje jau išfiltruoti,
  // šitas atskiria tuos, kurie pradelsti
  overduedFilter() {
    return defect => (!this.dateIsEmpty(defect.dtermin) &&
      defect.dtermin < this.byDate);
  }

  // iš turimų data išfiltruoja tuos defektus, kurie yra pradelsti
  activeAndOverduedFilter() {
    return defect => (defect.daptik <= this.byDate &&
      (this.dateIsEmpty(defect.panaikinta) || defect.panaikinta > this.byDate) &&
      !this.dateIsEmpty(defect.dtermin) &&
      defect.dtermin < this.byDate);
  }
  
  // prop date yra tuščias
  dateIsEmpty(prop) {
    return (
      prop === undefined ||
      prop === null ||
      prop === "" ||
      prop === "0000-00-00" ||
      !prop
    );
  }

  byIndSorter(a, b) {
    return a.ind - b.ind;
  }

  byVietaSorter(a, b) {
    if (a.linija > b.linija) return 1;
    if (a.linija < b.linija) return -1;
    if (a.kelias > b.kelias) return 1;
    if (a.kelias < b.kelias) return -1;
    if (a.km > b.km) return 1;
    if (a.km < b.km) return -1;
    if (a.pk > b.pk) return 1;
    if (a.pk < b.pk) return -1;
    if (a.m > b.m) return 1;
    if (a.m < b.m) return -1;
    if (a.siule > b.siule) return 1;
    if (a.siule < b.siule) return -1;
    if (a.iesmas > b.iesmas) return 1;
    if (a.iesmas < b.iesmas) return -1;
    if (a.nr > b.nr) return 1;
    if (a.nr < b.nr) return -1;
    return 0;
  }

}