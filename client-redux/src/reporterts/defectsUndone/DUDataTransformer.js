export class DUDataTransformer {
  data;
  byDate;
  whichDefects;
  meistrijos;

  constructor(data, params) {
    this.data = data;
    this.byDate = params.bydate || new Date().toISOString().split("T")[0];
    this.whichDefects = params.whichDefects; // active, overdued, both
    this.meistrijos = params.meistrijos;
  }

  // iš turimų data išfiltruoja visus defektus, kurie yra kelyje
  // ir tik tuos defektus, kurie yra reikalingose meistrijose
  activeFilter(defect) {
    return defect.daptik <= this.byDate &&
      (this.dateIsEmpty(defect.panaikinta) || defect.panaikinta > this.byDate) &&
      this.meistrijos.includes(defect.meistrija);
  }

  // laikoma, kad esantys kelyje jau išfiltruoti,
  // šitas atskiria tuos, kurie pradelsti
  overduedFilter(defect) {
    return !this.dateIsEmpty(defect.dtermin) &&
      defect.dtermin < this.byDate
  }

  // iš turimų data išfiltruoja tuos defektus, kurie yra pradelsti
  activeAndOverduedFilter(defect) {
    return this.activeFilter(defect) && 
    this.overduedFilter(defect)
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
      .map(m => {label: m.abbr, ind: m.ind, ids: [m.id]});
  }

  getPavojGroups() {
    return this.data.things.pavoj
      .filter(p => true)
      .map(p => {label: p.id, ind: p.ind, ids: [p.id]});
  }

  getContainer() {
    grMeistrijos = this.getMeistrijaGroups();
    grPavoj = this.getPavojGroups();
    grKkateg = this.getKkategGroups();

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
    return a - b;
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

export class DUDataNumbersTransformer extends DUDataTransformer {

  // data (defects, things (kkateg, pavoj, meistrija));
  // byDate;
  // whichDefects;
  // meistrijos;

  constructor(data, params) {
    super(data, params);
  }

  reduceToNumbers(container) {
    return container.map(m => (
      {...m, kkateg: m.kkateg.map(k => (
        {...k, pavoj: k.pavoj.map(p => (
          {...p, defects: p.defects.length}
        ))}
      ))}
    ))
  }

  createFullReportObject() {
    // kol kas su 'both' nedarysiu nieko
    let filter;
    if (this.whichDefects === 'active') {
      filter = this.activeFilter;
    } else if (this.whichDefects === 'overdued') {
      filter = this.activeAndOverduedFilter;
    } else {
      throw new Error(`Filter ${this.whicDefects} is not implemented yet`);
    }

    const filteredDefects = this.data.defects.filter(filter);
    let container = this.getContainer();
    this.distributeDefects(filteredDefects, container);
    const reduced = this.reduceToNumbers(container);
    return reduced;
  }  
}


/*

// TESTING
    
    function distributeDefects(defects, container) {
      container.forEach(meistr => {
        meistr.kkateg.forEach(kkateg => {
          kkateg.pavoj.forEach(pavoj => {
            pavoj.defects = defects.filter(d => 
              meistr.ids.includes(d.meistrija) && 
              kkateg.ids.includes(d.kkateg) && 
              pavoj.ids.includes(d.pavoj))
          })
        })
      });
      return container;
    }
    
  function byIndSorter(a, b) {
    return b.ind - a.ind;
  } 


function reduceToNumbers(container) {
    return container.map(m => (
      {...m, kkateg: m.kkateg.map(k => (
        {...k, pavoj: k.pavoj.map(p => (
          {...p, defects: p.defects.length}
        ))}
      ))}
    ));    
  }
    


    let grMeistrijos = [
    	{label: "km1", ind: 1, ids: ["1m"]},
    	{label: "km2", ind: 2, ids: ["2m"]},
    	{label: "km3", ind: 3, ids: ["3m"]},
    ];
    let grPavoj = [
    	{label: "d1", ind: 1, ids: ["1p"]},
    	{label: "d2", ind: 2, ids: ["2p"]},
    ];
    let grKkateg = [
    	{label: "1k", ind: 1, ids: ["1kk"]},
    	{label: "2k", ind: 2, ids: ["2kk"]},
    	{label: "3k, 4k", ind: 3, ids: ["3kk", "4kk"]},
    	{label: "kt", ind: 4, ids: ["5kk", "6kk"]},
    ];
    
    function getContainer() { 
      return grMeistrijos.map(m => (
        {...m, kkateg: grKkateg.map(k => (
          {...k, pavoj: grPavoj.map(p => (
            {...p}
          )).sort(byIndSorter)
        })).sort(byIndSorter)
      })).sort(byIndSorter);
    }
    
    let defects = [
    	{meistrija: "2m", pavoj: "1p", kkateg: "6kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "1kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "6kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "6kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "1p", kkateg: "5kk"},
    	{meistrija: "3m", pavoj: "2p", kkateg: "2kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "6kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "4kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "6kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "1p", kkateg: "1kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "6kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "2kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "6kk"},
    	{meistrija: "3m", pavoj: "2p", kkateg: "4kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "5kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "1kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "4kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "6kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "2kk"},      
    	{meistrija: "1m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "4kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "1p", kkateg: "4kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "1kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "2kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "2kk"},
    	{meistrija: "1m", pavoj: "1p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "1p", kkateg: "1kk"},
    	{meistrija: "3m", pavoj: "2p", kkateg: "4kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "5kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "1kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "2kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "5kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "3kk"},
    	{meistrija: "1m", pavoj: "1p", kkateg: "2kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "3kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "5kk"},
    	{meistrija: "2m", pavoj: "2p", kkateg: "1kk"},
    	{meistrija: "3m", pavoj: "1p", kkateg: "4kk"},
    	{meistrija: "1m", pavoj: "2p", kkateg: "6kk"},
    	{meistrija: "2m", pavoj: "1p", kkateg: "2kk"},
    ];
    
    var container = getContainer();
    console.log("container", container);
    var distributed = distributeDefects(defects, container);
    console.log("distributed", distributed);
    var reduced = reduceToNumbers(distributed);
    console.log("reduced", reduced);
  
*/