export class DULocalDataManager {

  getState = null;

  setStateGetter(getState) {
    this.getState = getState;
  }

  // public
  apiUrl = "api/report/defects-undone";

  // public
  hasLocalData() {
    return (
      this.getState().allItems["defect"] &&
      this.getState().things.data.kkateg &&
      this.getState().things.data.pavoj &&
      this.getState().things.data.meistrija
    );
  }

  // public
  getLocalData() {
    if (this.hasLocalData()) {
      return {
        defects: this.getState().allItems["defect"],
        things: {
          kkateg: this.getState().things.data.kkateg,
          pavoj: this.getState().things.data.pavoj,
          meistrija: this.getState().things.data.meistrija
        }
      };
    } else {
      return null;
    }
  }
}