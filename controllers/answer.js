const service = require( "../services/answer");
const errorMsg = require( "../services/error");
const authService = require( "../services/auth");
const validator = require( "../services/validator");

const postAnswer = (req, res) => {
  let data = { questionid: req.params.questionid, answer: req.body.body };
  if (authService.checkAuth(req)) {
    if (validator.checkValidInputes(data)) {
      return service
        .postAnswer(req)
        .then(execute => {
          res.send(errorMsg.info("Operation was successful", true, execute));
        })
        .catch(err => {
          res.send(errorMsg.error(err));
        });
    }
    return res.send(errorMsg.info(data.data.toString()));
  }
  return res.send(errorMsg.info("Operation failed. No token"));
};

const vote = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.validDatatype(req.params.id)) {
      if ([-1, 1].includes(parseInt(req.body.vote))) {
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
      return res.send(errorMsg.info("Operation failed. Invalid vote value (1 or -1 only valid)"));
    }
    return res.send(errorMsg.info("Operation failed. Wrong input data integer required"));
  }
  return res.send(errorMsg.info("Operation failed. No token"));
};

const acceptedAnswer = (req, res) => {
  // && validator.validDatatype(req.params.questionid) && validator.validDatatype(req.params.answerid)
  if (authService.checkAuth(req)) {
    if (validator.checkValidInputes(req.params)) {
      return service
        .acceptedAnswer(req.params.questionid, req.params.answerid)
        .then(execute => {
          if (execute.length > 0) {
            if (execute[0].preferred == req.params.answerid)
              return res.json(errorMsg.info("Operation was successful", true, execute));
            else return res.json(errorMsg.info("Operation failed. Wrong answer id"));
          } else
            return res.json(errorMsg.info("Operation failed. You cannot perform this operation"));
        })
        .catch(err => {
          res.json(errorMsg.error(err));
        });
    }
    return res.send(errorMsg.info(req.params.data));
  }
  return res.send(errorMsg.info("Operation failed. Access denied"));
};

const comment = (req, res) => {
  //&& validator.notEmpty(req.body.body) && validator.validDatatype(req.params.id)
  if (authService.checkAuth(req)) {
    let data = { comment: req.body.body, answerid: req.params.id };
    if (validator.checkValidInputes(data)) {
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
    return res.json(errorMsg.info(data.data));
  }
  return res.json(errorMsg.info("Operation failed. Access Denied."));
};

module.exports = {
  postAnswer,
  vote,
  acceptedAnswer,
  comment
};
