import reporterMap from "./reporterMap";

export default class Reporter {
  reporter;
  getState;

  constructor(rtype, getState) {
    console.log("getState", getState);
    this.getState = getState;
    console.log("reporterMap", reporterMap);
    console.log("rtype", rtype);
    this.reporter = reporterMap[rtype]; 
    //this.getState = this.getState.bind(this);    
  }

  // public
  localDataExists() {
    console.log("Reporter getState", this. getState);
    return this.reporter.localDataManager.hasLocalData(this.getState);
  }

  // public
  getLocalData() {
    if (!this.reporter.localDataManager.hasLocalData(this.getState)) {
      return null;
    }
    return this.reporter.localDataManager.getLocalData(this.getState);
  }

  // public
  createReport(data, params) {
    console.log("createReport data params", data, params);
    const transformer = new this.reporter.DataTransformerClass(data, params);
    return transformer.createReport();
  }

  // public
  getUrl() {
    return this.reporter.apiUrl;
  }
}