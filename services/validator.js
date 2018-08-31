const notEmpty = value => {
  if (value.trim() == "") return false;
  return true;
};

const validEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const htmlSpecialCharacter = text => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const validDatatype = (value, datatype = "integer") => {
  if (datatype === "integer") {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
  } else if (typeof value == datatype) return true;
  return false;
};

const checkValidInputes = (_object, validateEmail = false, expectedInteger = false) => {
  let valid = true,
    data = [];
  for (var key in _object) {
    if (_object.hasOwnProperty(key)) {
      if (!notEmpty(_object[key])) {
        data.push(`${key} must not be empty`);
        valid = false;
      } else if (key == "email" && validateEmail) {
        if (!validEmail(_object[key])) {
          data.push(`invalid ${key} '${_object[key]}'`);
          valid = false;
        }
      }
      if (key.indexOf("id") > -1 && !validDatatype(_object[key])) {
        data.push(`invalid datatype for ${key}; required data type is integer`);
      }
    }
  }
  _object.data = data;
  return valid;
};

module.exports = {
  notEmpty,
  validEmail,
  htmlSpecialCharacter,
  validDatatype,
  checkValidInputes
};
