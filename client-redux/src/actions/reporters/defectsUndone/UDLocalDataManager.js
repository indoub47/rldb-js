import isEmpty from "../../../validation/is-empty";
export class UDLocalDataManager {

  // public
  hasLocalData(getState) {
    //console.log("UDLocalDataManager.hasLocalData getState", getState);
    return (
      !isEmpty(getState().allItems["defect"]) &&
      !isEmpty(getState().things.data.kkateg) &&
      !isEmpty(getState().things.data.pavoj) &&
      !isEmpty(getState().things.data.meistrija)
    );
  }

  // public
  getLocalData(getState) {
    if (this.hasLocalData(getState)) {
      return {
        defects: getState().allItems["defect"],
        things: {
          kkateg: getState().things.data.kkateg,
          pavoj: getState().things.data.pavoj,
          meistrija: getState().things.data.meistrija
        }
      };
    } else {
      return null;
    }
  }
}