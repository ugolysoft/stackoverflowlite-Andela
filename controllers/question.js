var serviceQns = require("../services/question");
var errorMsg = require("../services/error");
const authService = require("../services/auth");

function getAllQuestions(req, res) {
  return serviceQns
    .allQuestions()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      res.json(errorMsg.error(err));
    });
}
function getQuestion(req, res) {
  return serviceQns
    .getQuestion(req.params.id)
    .then(results => {
      let ans = [],
        qns = {};
      if (results.length > 0) {
        results.forEach(value => {
          qns = {
            title: value.title,
            body: value.question,
            askeddby: value.name,
            on: value.askeddate
          };
          if (value.answer != null && value.answer != "") {
            ans.push({
              body: value.answer,
              answeredby: value.answeredby,
              answerdate: value.ansdate,
              id: value.ansid,
              votes: value.vote
            });
          }
        });
      }
      res.json({ question: qns, answers: ans });
    })
    .catch(err => {
      res.json(errorMsg.error(err));
    });
}

function postQuestion(req, res) {
  if (authService.checkAuth(req) && req.body.body != "" && req.body.title != "") {
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

function updateQuestion(req, res) {
  if (authService.checkAuth(req) && (req.body.title != "" && req.body.body != "")) {
    let params = {
      id: req.params.id,
      body: req.body.body,
      title: req.body.title,
      userid: req.user.id
    };
    return serviceQns
      .updateQuestion(params)
      .then(execute => {
        if (execute.length > 0) {
          return res.send(errorMsg.info("update successful", true, execute));
        } else {
          return res.send(errorMsg.info("You cannot update this question"));
        }
      })
      .catch(err => {
        res.json(errorMsg.error(err, "Fail to save question. try again later. "));
      });
  }
}

function deleteQuestion(req, res) {
  if (authService.checkAuth(req)) {
    return serviceQns
      .deleteQuestion(req.params.id, req.user.id)
      .then(execute => {
        if (execute.length > 0) res.json(errorMsg.info("Operation was successful", true, execute));
        else res.json(errorMsg.info("You cannot delete question you did not post"));
      })
      .catch(err => {
        res.json(errorMsg.error(err, "Fail to delete question. try again later. "));
      });
  }
}

module.exports = {
  getAllQuestions,
  getQuestion,
  postQuestion,
  updateQuestion,
  deleteQuestion
};
