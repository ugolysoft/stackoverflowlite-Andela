const service = require("../services/answer");
const message = require("../services/message");
const authService = require("../services/auth");
const validator = require("../services/validator");

const postAnswer = (req, res) => {
  let data = { questionid: req.params.questionid, answer: req.body.body };
  if (authService.checkAuth(req)) {
    if (validator.checkValidInputes(data, ["questionid", "answer"])) {
      return service
        .postAnswer(req)
        .then(execute => {
          res.send(message.info("Operation was successful", true, execute));
        })
        .catch(err => {
          res.send(message.error(err));
        });
    }
    return res.send(message.info(data.data.toString()));
  }
  return res.send(message.info("Operation failed. No token"));
};

const vote = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.validDatatype(req.params.id)) {
      if ([-1, 1].includes(parseInt(req.body.vote))) {
        return service
          .vote(req)
          .then(execute => {
            let msg =
              execute.length > 0
                ? message.info("Vote saved", true, execute)
                : message.info("You have already voted for this answer");
            res.send(msg);
          })
          .catch(err => {
            res.send(message.error(err));
          });
      }
      return res.send(message.info("Operation failed. Invalid vote value (1 or -1 only valid)"));
    }
    return res.send(message.info("Operation failed. Wrong input data integer required"));
  }
  return res.send(message.info("Operation failed. No token"));
};

const acceptedAnswer = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.checkValidInputes(req.params,["questionid"], ["answerid"])) {
      return service
        .acceptedAnswer(req.params.questionid, req.params.answerid)
        .then(execute => {
          if (execute.length > 0) {
            if (execute[0].preferred == req.params.answerid)
              return res.json(message.info("Operation was successful", true, execute));
            else return res.json(message.info("Operation failed. Wrong answer id"));
          } else
            return res.json(message.info("Operation failed. You cannot perform this operation"));
        })
        .catch(err => {
          res.json(message.error(err));
        });
    }
    return res.send(message.info(req.params.data));
  }
  return res.send(message.info("Operation failed. Access denied"));
};

const comments = (req, res) => {
  if (validator.validDatatype(req.params.questionid)) {
    return service
      .comments(req.params.questionid)
      .then(execute => {
        return res.json(message.info("answers comments", true, execute));
      })
      .catch(err => {
        res.json(message.error(err));
      });
  }
  return res.send(message.info("Wrong data type integer required"));
};

const comment = (req, res) => {
  if (authService.checkAuth(req)) {
    let data = { comment: req.body.body, answerid: req.params.id };
    if (validator.checkValidInputes(data, ["comment", "answerid"])) {
      return service
        .addComment(req)
        .then(execute => {
          if (execute.length > 0) {
            res.json(message.info("Operation was successful", true, execute));
          } else res.json(message.info("Operation failed. You send a wrong answer id"));
        })
        .catch(err => {
          res.json(message.error(err));
        });
    }
    return res.json(message.info(data.data));
  }
  return res.json(message.info("Operation failed. Access Denied."));
};

const updateAnswer = (req, res) => {
  if (authService.checkAuth(req)) {
    let data = {
      id: req.params.id,
      body: req.body.body,
      userid: req.user.id
    };
    if (validator.checkValidInputes(data, ["body", "id"])) {
      return service
        .updateAnswer(data)
        .then(execute => {
          if (execute.length > 0) {
            return res.send(message.info("update successful", true, execute));
          } else {
            return res.send(message.info("Operation failed. You cannot update this answer"));
          }
        })
        .catch(err => {
          res.send(message.error(err));
        });
    }
    return res.send(message.info(data.data));
  }
  return res.send(message.info("Operation failed. Access denied"));
};

module.exports = {
  postAnswer,
  vote,
  acceptedAnswer,
  comment,
  comments,
  updateAnswer
};
