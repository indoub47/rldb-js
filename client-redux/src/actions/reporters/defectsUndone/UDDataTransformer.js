export class UDDataTransformer {
  data;
  byDate;
  whichDefects;
  meistrijos;

  constructor(data, params) {
    this.byDate = params.bydate || new Date().toISOString().split("T")[0];
    this.whichDefects = params.whichDefects; // active, overdued, both
    this.meistrijos = params.meistrijos;    
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

  createReport() {
    console.log("in UDDataTransformer data, byDate, defects, meistrijos", this.data, this.byDate, this.whichDefects, this.meistrijos)
    const filter = this.createFilter();
    console.log("this.data.defects", this.data.defects);
    console.log("filter", filter);
    const filteredDefects = this.data.defects.filter(filter); 
    console.log("filteredDefects", filteredDefects);   
    let container = this.getContainer();
    console.log("container", container);
    this.distributeDefects(filteredDefects, container);
    console.log("container with defects", container);
    return container
  }  

  // iš turimų data išfiltruoja visus defektus, kurie yra kelyje
  // ir tik tuos defektus, kurie yra reikalingose meistrijose
  activeFilter() {
    return defect => (defect.daptik <= this.byDate &&
      (this.dateIsEmpty(defect.panaikinta) || defect.panaikinta > this.byDate) &&
      this.meistrijos.includes(defect.meistrija));
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
      this.meistrijos.includes(defect.meistrija) &&
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

   getKkategGroups() {
    return [
      {label: "1", ind: 1, ids: ["1"]},
      {label: "2", ind: 2, ids: ["2"]},
      {label: "3, 4", ind: 3, ids: ["3", "4"]},
      {label: "kt.", ind: 4, ids: ["5", "6", "7"]}
    ];
  }

  getMeistrijaGroups() {
    return this.data.things.meistrija
      .filter(m => this.meistrijos.includes(m.id))
      .map(m => ({label: m.abbr, ind: m.ind, ids: [m.id]}));
  }

  getPavojGroups() {
    return this.data.things.pavoj
      .filter(p => true)
      .map(p => ({label: p.id, ind: p.ind, ids: [p.id]}));
  }

  getContainer() {
    const grMeistrijos = this.getMeistrijaGroups();
    const grPavoj = this.getPavojGroups();
    const grKkateg = this.getKkategGroups();

    return grMeistrijos.map(m => (
    	{...m, kkateg: grKkateg.map(k => (
      	{...k, pavoj: grPavoj.map(p => (
        	{...p}
        )).sort(this.byIndSorter)
      })).sort(this.byIndSorter)
    })).sort(this.byIndSorter);
  }

  distributeDefects(defects, container) {
    // distributes, sorts and marks overdued
    container.forEach(meistr => {
        meistr.kkateg.forEach(kkateg => {
          kkateg.pavoj.forEach(pavoj => {
            pavoj.defects = defects.filter(d => 
              meistr.ids.includes(d.meistrija) && 
              kkateg.ids.includes(d.kkateg) && 
              pavoj.ids.includes(d.pavoj))
            .sort(this.byVietaSorter)
            // .map(d => {
            //   if (this.overduedFilter(d)) d.overdued = true;
            //   return d
            // });
          });
        });
      });
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