import UDDataTransformer from "./UDDataTransformer";

export class UDDataNumberTransformer extends UDDataTransformer {

  // data (defects, things (kkateg, pavoj, meistrija));
  // byDate;
  // whichDefects;
  // meistrijos;

  constructor(data, params) {
    super(data, params);
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

  

  createReport() {
    const filter = this.createFilter();
    console.log("this.data", this.data);
    const filteredDefects = this.data.defects.filter(filter);
    const container = this.getContainer();
    const report = this.distributeDefects(filteredDefects, container);
    console.log("report in createReport", report);
    return report;
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

    const report = this.reduceToNumbers(container);

    console.log("distributeDefects report", report);
    return report;
  }

  reduceToNumbers(fullReport) {
    return fullReport.map(m => (
      {...m, kkateg: m.kkateg.map(k => (
        {...k, pavoj: k.pavoj.map(p => (
          {...p, defects: p.defects.length}
        ))}
      ))}
    ))
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