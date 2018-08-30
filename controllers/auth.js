const bcrypt = require("bcrypt");
const authService = require("../services/auth");
const userService = require("../services/user");
var errorMsg = require("../services/error");
const validator = require("../services/validator");
function login(req, res) {
  if (validator.notEmpty(req.body.email) && validator.notEmpty(req.body.password)) {
    return authService
      .authenticate(req.body)
      .then(result => {
        if (typeof result.token === "undefined") res.status(401).send(result);
        res.send(result);
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Wrong email or password"));
}

function register(req, res) {
  if (
    validator.notEmpty(req.body.email) &&
    validator.notEmpty(req.body.name) &&
    validator.notEmpty(req.body.password)
  ) {
    var user = {
      email: validator.htmlSpecialCharacter(req.body.email),
      password: bcrypt.hashSync(req.body.password, 2),
      name: validator.htmlSpecialCharacter(req.body.name)
    };
    return userService
      .addUser(user)
      .then(execute => {
        if (execute.length > 0)
          return res.send(errorMsg.info("Resgistration was successful", true, execute));
        return res.send(errorMsg.info(`Operation failed. Email '${user.email}' already exist.`));
      })
      .catch(err => {
        return res.status(400).send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Please fill all the boxes"));
}

module.exports = {
  login,
  register
};
