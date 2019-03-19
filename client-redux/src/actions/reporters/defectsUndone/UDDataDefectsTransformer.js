import UDDataTransformer from "./UDDataTransformer";

export class UDDataDefectsTransformer extends UDDataTransformer {
  constructor(data, params) {
    super(data, params);
    //
  }

  getContainer() {
    return this.data.things.meistrija
      .filter(m => this.meistrijos.includes(m.id));
  }

  distributeDefects(defs, container) {
    console.log("distributeDefects defects, container", defs, container);
    const distributed = container.map(meistrija => {
      return {
        ...meistrija,
        defects: defs
          .filter(d => d.meistrija === meistrija.id)
          .sort(this.byVietaSorter)
      };
    }).sort(this.byIndSorter);
    console.log("distributeDefects container after distribution", distributed);
    return distributed;
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
}
