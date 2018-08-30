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
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10))
      ? true
      : false;
  } else if (typeof value == datatype) return true;
  return false;
};

module.exports = {
  notEmpty,
  validEmail,
  htmlSpecialCharacter,
  validDatatype
};
