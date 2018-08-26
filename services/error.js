const error = (error, msg = "Operation failed. Please try again later.") => {
  console.log(error);
  return {
    success: false,
    message: msg
  };
};

const info = msg => {
  return {
    success: true,
    message: msg
  };
};

module.exports = {
  error,
  info
};
