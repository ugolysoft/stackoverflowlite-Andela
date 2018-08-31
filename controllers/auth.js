import authService from "../services/auth";
import userService from "../services/user";
import errorMsg from "../services/error";
import validator from "../services/validator";

const login = (req, res) => {
  if (validator.checkValidInputes(req.body)) {
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
  return res.send(errorMsg.info(req.body.data.toString()));
};

const register = (req, res) => {
  if (validator.checkValidInputes(req.body, true)) {
    return userService
      .addUser(req.body)
      .then(execute => {
        if (execute.length > 0)
          return res.send(errorMsg.info("Resgistration was successful", true));
        return res.send(
          errorMsg.info(`Operation failed. Email '${req.body.email}' already exist.`)
        );
      })
      .catch(err => {
        return res.status(400).send(errorMsg.error(err, "this is error"));
      });
  }
  return res.send(errorMsg.info(req.body.data.toString()));
};

module.exports = {
  login,
  register
};
