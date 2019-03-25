import UDDataTransformer from "./UDDataTransformer";
import createDefectCountReport from "./createDefectCountReport";
import transformDefectCounts from "./transformDefectCounts";

export class UDDataNumberTransformer extends UDDataTransformer {
  // data (counts/defects, things (kkateg, pavoj, meistrija));
  // byDate;
  // whichDefects;
  // local;

  constructor(data, params) {
    super(data, params);
  }

  createReport() {
    if (this.local) {
      const filter = this.createFilter();
      const filteredDefects = this.data.defects.filter(filter);
      return createDefectCountReport(this.data.things, filteredDefects);
    }

    // fetches filtered and transformed data from server
    return transformDefectCounts(this.data.counts, this.data.things); 
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
