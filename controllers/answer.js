var service = require("../services/answer");
var errorMsg = require("../services/error");
const authService = require("../services/auth");
const validator = require("../services/validator");

function postAnswer(req, res) {
  if (
    authService.checkAuth(req) &&
    validator.notEmpty(req.body.body) &&
    validator.validDatatype(req.params.questionid)
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
  return res.send(errorMsg.info("Operation failed. Empty field(s) or no token"));
}

function vote(req, res) {
  if (
    authService.checkAuth(req) &&
    validator.validDatatype(req.params.id) &&
    [-1, 1].includes(parseInt(req.body.vote))
  ) {
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
  if (
    authService.checkAuth(req) &&
    validator.validDatatype(req.params.questionid) &&
    validator.validDatatype(req.params.answerid)
  ) {
    return service
      .acceptedAnswer(req.params.questionid, req.params.answerid)
      .then(execute => {
        if (execute.length > 0) {
          if (execute[0].preferred == req.params.answerid)
            res.json(errorMsg.info("Operation was successful", true, execute));
          else res.json(errorMsg.info("Operation failed. Wrong answer id"));
        } else res.json(errorMsg.info("Operation failed. You cannot perform this operation"));
      })
      .catch(err => {
        res.json(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Wrong datatype or no token"));
}

function comment(req, res) {
  if (
    authService.checkAuth(req) &&
    validator.notEmpty(req.body.body) &&
    validator.validDatatype(req.params.id)
  ) {
    return service
      .addComment(req)
      .then(execute => {
        if (execute.length > 0) {
          res.json(errorMsg.info("Operation was successful", true, execute));
        } else res.json(errorMsg.info("Operation failed. You send a wrong answer id"));
      })
      .catch(err => {
        res.json(errorMsg.error(err));
      });
  }
  return res.json(errorMsg.info("Operation failed. Empty box(es)."));
}

module.exports = {
  postAnswer,
  vote,
  acceptedAnswer,
  comment
};
