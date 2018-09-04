const error = (error, msg = "Operation failed. Please try again later.") => {
  console.log(error);
  return {
    success: false,
    message: msg,
    data: ""
  };
};

const info = (msg, success = false, data = "") => {
  return {
    success: success,
    message: msg,
    data: data
  };
};

module.exports = {
  error,
  info
};
