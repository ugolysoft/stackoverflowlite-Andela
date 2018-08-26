var service = require("../services/answer");
var errorMsg = require("../services/error");
const authService = require("../services/auth");

function postAnswer(req, res) {
  if (req.headers["token"] && req.body.body != "" && req.params.questionid != "") {
    const valid = authService.checkAuth(req.headers["token"]);
    if (!valid.success) {
      return res.send(valid);
    }
    req.user = valid.user;
    return service
      .postAnswer(req)
      .then(execute => {
        res.send({
          success: true,
          message: "Operation was successful",
          data: execute
        });
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  res.send({ message: "Operation failed. Empty field or no token", success: false });
}

module.exports = {
  postAnswer
};
