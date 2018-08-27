const bcrypt = require("bcrypt");
const authService = require("../services/auth");
const userService = require("../services/user");
var errorMsg = require("../services/error");
function login(req, res) {
  if (req.body.email != "" && req.body.password != "") {
    return authService
      .authenticate(req.body)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        res.send(errorMsg.error(err, "Wrong email or password"));
      });
  }
  return res.send(errorMsg.info("Please provide email and password"));
}

function register(req, res) {
  if (req.body.email != "" && req.body.name != "" && req.body.password != "") {
    var user = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 2),
      name: req.body.name
    };
    return userService
      .addUser(user)
      .then(execute => {
        if (execute.length > 0)
          return res.send(errorMsg.info("Resgistration was successful", true, execute));
        return res.send(
          errorMsg.info(`Registration failed. Email '${user.email}' already exist.`, false, execute)
        );
      })
      .catch(err => {
        return res.status(400).send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Please fill all the boxes"));
}

module.exports = {
  login,
  register
};
