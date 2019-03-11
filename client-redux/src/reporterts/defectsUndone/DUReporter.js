import {DUDataTransformer, DUDataNumberTransformere} from "./DUDataTransformer";
import {DULocalDataManager} from "./DULocalDataManager";
import {DUParamsCollector} from "./DUParamsCollector";

export class DUReporter {
  
  data;
  constructor() {
    this.localDataManager = new DULocalDataManager();
    this.paramsCollector = new DUParamsCollector();
    this.DUDataTransformer = 
  }


  setFetchedData(fetchedData) {
    this.data = fetchedData;
  }

  // public
  fetchedDataToReport(params, fetchedData) {
    // fetchedData: {things: {meistrija: [...], pavoj:[...], kkateg: [...]}, filteredDefects: [...]}
    const report = this.arrayToFullReport(
      fetchedData.filteredDefects,
      fetchedData.things
    );
    if (params.reduced) {
      return this.reduceReport(report);
    }
    return report;
  }

  // public
  localDataToReport(params, getState) {
    const defects = getState().allItems["defect"];
    const filteredDefects = defects.filter(this.getFilter(params));
    const things = getState().things;
    const report = this.arrayToFullReport(filteredDefects, things);
    if (params.reduced) {
      return this.reduceReport(report);
    }
    return report;
  }

  

  

  // private
  arrayToFullReport(arr, things) {
    // 1. create empty object for holding all defects
    const { meistrija, kkateg, pavoj } = things;
    const grouped = {};
    meistrija.forEach(m => {
      grouped[m.name] = {};
      pavoj.forEach(p => {
        grouped[m.name][p.name] = {};
        kkateg.forEach(k => {
          grouped[m.name][p.name][k.name] = [];
        });
      });
    });
    // 2. distribute defects for each meistrija-kkateg-pavoj set
    arr.forEach(d => {
      grouped[d.meistrija][d.pavoj][d.kkateg].push(d);
    });

    return grouped;
  }

  propGroups(things) {
    // sukuria grupavimo props arrays - nes 
    // grupavimas gali neatitikti esamų props
    return {
      meistrija: this.meistrijaGroups(things.meistrija),
      pavoj: this.pavojGroups(things.pavoj),
      kkateg: this.kkategGroups();
    };
  }

  meistrijaGroups(meistrijaArr) {
    // creates
    // {
    //  "1": {id: "1", name: "Pavenčių", abbr: "KM-1", ...},
    //  "2": {id: "2", name: "Tryškių", abbr: "KM-2", ...},
    //  ...
    //  "15": {id: "15", name: "Viduklės", abbr: "KM-15", ...}
    // }
    let meistrija = {};
    meistrijaArr.forEach(m => meistrija[m.id] = [m]);
    return meistrija;
  }

  kkategGroups() {
    return [
      {label: "1", ind: 1, ids: ["1"]},
      {label: "2", ind: 2, ids: ["2"]},
      {label: "3, 4", ind: 3, ids: ["3", "4"]},
      {label: "kt.", ind: 4}, ids: ["5", "6", "7"]
    ];
  }

  pavojGroups(pavojArr) {
    // creates
    // {
    //  "D3": {id: "D1", ind: 0},
    //  "D2": {id: "D2", ind: 1},
    //  ...
    //  "ID": {id: "ID", ind: 5}
    // }
    let pavoj = {};
    pavojArr.forEach(p => pavoj[p.id] = [p]);
    return pavoj;
  }

  // private
  reduceReport(fullReport) {
    // pašalina defektus, grąžina tik jų kiekį, vnt.
    return fullReport.map(m => m.map(p => p.map(kk => kk.length)));
  }
}