const bcrypt = require("bcrypt");
const authService = require("../services/auth");
const userService = require("../services/user");
var errorMsg = require("../services/error");
function login(req, res) {
  if (req.body.email && req.body.password && req.body.email != "" && req.body.password != "") {
    return authService
      .authenticate(req.body)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        res.send(errorMsg.error(err, "Wrong email or password"));
      });
  }
  return errorMsg.info("Please provide email and password");
}

function register(req, res) {
  if (
    req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.email != "" &&
    req.body.name != "" &&
    req.body.password != ""
  ) {
    var email = req.body.email;
    return userService.getUserByLogin(req.body.email).then(exists => {
      if (exists) {
        return res.send(
          errorMsg.info(`Registration failed. User with this email '${email}' already registered.`)
        );
      }
      var user = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 2),
        name: req.body.name
      };
      return userService
        .addUser(user)
        .then(() => {
          res.send(errorMsg.info("Resgistration was successful", true));
        })
        .catch(err => {
          res.status(400).send(errorMsg.error(err));
        });
    });
  }
  return res.send(errorMsg.info("Please fill all the boxes"));
}

module.exports = {
  login,
  register
};
