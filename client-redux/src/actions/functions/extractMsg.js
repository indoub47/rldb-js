function errorsToMsg(errors) {
  return Object.keys(errors).map(key => errors[key].label + ": " + errors[key].msg);
}


export default function extractMsg(error) {
  let errmsg = "";
  if (error.response && error.response.data) {
    if (error.response.data.msg) {
      errmsg = error.response.data.msg;
    } else if (error.response.data.errors) {
      errmsg = errorsToMsg(error.response.data.errors);
    } else {
      errmsg = "Error: " + error.message;
    }
  } else {
    errmsg = "Error: " + error.message;
  }
  return errmsg;
}