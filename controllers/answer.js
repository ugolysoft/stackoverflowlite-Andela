var service = require("../services/answer");
var errorMsg = require("../services/error");
const authService = require("../services/auth");

function postAnswer(req, res) {
  if (authService.checkAuth(req) && req.body.body != "" && req.params.questionid != "") {
    return service
      .postAnswer(req)
      .then(execute => {
        res.send(errorMsg.info("Operation was successful", true, execute));
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Empty field or no token"));
}

function vote(req, res) {
  if (authService.checkAuth(req) && [-1, 1].includes(parseInt(req.body.vote))) {
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

function acceptedAnswer(req, res) {
  if (authService.checkAuth(req)) {
    return service
      .acceptedAnswer(req.params.questionid, req.params.answerid)
      .then(execute => {
        if (execute.length > 0) {
          if (execute[0].preferred == req.params.answerid)
            res.json(errorMsg.info("Operation was successful", true, execute));
          else res.json(errorMsg.info("Wrong answer id"));
        } else res.json(errorMsg.info("You cannot perform this operation"));
      })
      .catch(err => {
        res.json(errorMsg.error(err, "Fail to delete question. try again later. "));
      });
  }
}

module.exports = {
  postAnswer,
  vote,
  acceptedAnswer
};
