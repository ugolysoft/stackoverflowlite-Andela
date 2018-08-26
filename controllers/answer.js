var service = require("../services/answer");
var errorMsg = require("../services/error");
const authService = require("../services/auth");

function postAnswer(req, res) {
  if (
    req.body.body &&
    req.params.questionid &&
    authService.checkAuth(req) &&
    req.body.body != "" &&
    req.params.questionid != ""
  ) {
    return service
      .postAnswer(req)
      .then(execute => {
        res.send(errorMsg.info("Operation was successful", true, execute));
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  res.send(errorMsg.info("Operation failed. Empty field or no token"));
}

function vote(req, res) {
  if (req.body.vote && authService.checkAuth(req) && [-1, 1].includes(parseInt(req.body.vote))) {
    return service
      .vote(req)
      .then(execute => {
        res.send({
          success: true,
          message:
            execute.length > 0
              ? "Operation was successful"
              : "You have already voted for this answer",
          data: execute
        });
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Wrong input (1 or -1 only valid) or no token"));
}

module.exports = {
  postAnswer,
  vote
};
