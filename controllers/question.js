var serviceQns = require("../services/question");
var errorMsg = require("../services/error");
const authService = require("../services/auth");
const validator = require("../services/validator");

function getAllQuestions(req, res) {
  return serviceQns
    .allQuestions()
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      res.send(errorMsg.error(err));
    });
}

function getQuestion(req, res) {
  if (validator.validDatatype(req.params.id, "integer")) {
    return serviceQns
      .getQuestion(req.params.id)
      .then(results => {
        res.send(results);
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Wrong data type; valid datatype integer"));
}

function myQuestions(req, res) {
  if (authService.checkAuth(req)) {
    return serviceQns
      .myQuestions(req.user.id)
      .then(execute => {
        res.send(execute);
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. No token"));
}

function postQuestion(req, res) {
  if (
    authService.checkAuth(req) &&
    validator.notEmpty(req.body.body) &&
    validator.notEmpty(req.body.title)
  ) {
    return serviceQns
      .postQuestion(req)
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
  return res.send(errorMsg.info("Operation failed. No token or empty field"));
}

function search(req, res) {
  if (validator.notEmpty(req.body.search)) {
    return serviceQns
      .search(req.body.search)
      .then(results => {
        res.send(results);
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Search field is empty"));
}

function updateQuestion(req, res) {
  if (
    authService.checkAuth(req) &&
    validator.notEmpty(req.body.title) &&
    validator.notEmpty(req.body.body) &&
    validator.validDatatype(req.params.id, "integer")
  ) {
    let params = {
      id: req.params.id,
      body: validator.htmlSpecialCharacter(req.body.body),
      title: validator.htmlSpecialCharacter(req.body.title),
      userid: req.user.id
    };
    return serviceQns
      .updateQuestion(params)
      .then(execute => {
        if (execute.length > 0) {
          return res.send(errorMsg.info("update successful", true, execute));
        } else {
          return res.send(errorMsg.info("Operation failed. You cannot update this question"));
        }
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Empty box(es)"));
}

function deleteQuestion(req, res) {
  if (authService.checkAuth(req) && validator.validDatatype(req.params.id, "integer")) {
    return serviceQns
      .deleteQuestion(req.params.id, req.user.id)
      .then(execute => {
        if (execute.length > 0) res.send(errorMsg.info("Operation was successful", true, execute));
        else
          res.send(errorMsg.info("Operation failed. You cannot delete question you did not post"));
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Wrong data type"));
}

module.exports = {
  getAllQuestions,
  getQuestion,
  postQuestion,
  updateQuestion,
  deleteQuestion,
  search,
  myQuestions
};
