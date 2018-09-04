const authService = require("../services/auth");
const userService = require("../services/user");
const message = require("../services/message");
const validator = require("../services/validator");

const login = (req, res) => {
  if (validator.checkValidInputes(req.body, ["email", "password"])) {
    return authService
      .authenticate(req.body)
      .then(result => {
        if (typeof result.token === "undefined") res.status(401).send(message.info(result));
        res.send(message.info("login successful", true, result));
      })
      .catch(err => {
        res.send(message.error(err));
      });
  }
  return res.send(message.info(req.body.data.toString()));
};

const register = (req, res) => {
  if (validator.checkValidInputes(req.body, ["email", "name", "password"], true)) {
    return userService
      .addUser(req.body)
      .then(execute => {
        if (execute.length > 0) return res.send(message.info("Resgistration was successful", true));
        return res.send(message.info(`Operation failed. Email '${req.body.email}' already exist.`));
      })
      .catch(err => {
        return res.status(400).send(message.error(err, "this is error"));
      });
  }
  return res.send(message.info(req.body.data.toString()));
};

const userData = (req, res) => {
  if (authService.checkAuth(req)) {
    return res.json(message.info("user data", true, req.user));
  }
  return res.send(message.info("invalid token"));
};

module.exports = {
  login,
  register,
  userData
};
