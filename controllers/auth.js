const bcrypt = require("bcrypt");
const authService = require("../services/auth");
const userService = require("../services/user");
var errorMsg = require("../services/error");
function login(req, res) {
  return authService
    .authenticate(req.body)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(errorMsg.error(err, "Wrong email or password"));
    });
}

function register(req, res) {
  var email = req.body.email;
  return userService.getUserByLogin(req.body.email).then(exists => {
    if (exists) {
      return res.send({
        message: `Registration failed. User with this email '${email}' already registered.`,
        success: false
      });
    }
    var user = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 2),
      name: req.body.name
    };
    return userService
      .addUser(user)
      .then(() => {
        res.send({ success: true, message: "Resgistration was successful" });
      })
      .catch(err => {
        res.status(400).send({ success: false, error: err });
      });
  });
}

module.exports = {
  login,
  register
};
