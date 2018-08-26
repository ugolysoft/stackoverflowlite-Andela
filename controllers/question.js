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
            body: value.body,
            askeddby: value.name,
            on: value.askeddate
          };
          if (value.ans != null && value.ans != "") {
            ans.push({
              body: value.ans,
              answeredby: value.ansby,
              answerdate: value.ansdate
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
  if (req.headers["token"] && req.body.body != "" && req.body.title != "") {
    const valid = authService.checkAuth(req.headers["token"]);
    if (!valid.success) {
      return res.send(valid);
    }
    req.user = valid.user;
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
  return res.send({ success: false, message: "Operation failed. No token or empty field" });
}

function updateQuestion(req, res) {
  if (req.headers["token"]) {
    const valid = authService.checkAuth(req.headers["token"]);
    if (!valid.success) {
      return res.send(valid);
    }
    req.user = valid.user;
    return serviceQns.getQuestion(req.params.id).then(results => {
      if (results[0].id) {
        if (results[0].askedby == req.user.id) {
          let params = {
            id: req.params.id,
            body: req.body.body || results[0].body,
            title: req.body.title || results[0].title
          };
          return serviceQns
            .updateQuestion(params)
            .then(execute => {
              res.json(execute);
            })
            .catch(err => {
              res.json(errorMsg.error(err, "Fail to save question. try again later. "));
            });
        } else {
          res.json(errorMsg.info("You cannot edit this question"));
        }
      } else {
        res.json(errorMsg.info("No data found"));
      }
    });
  }
}

function deleteQuestion(req, res) {
  if (req.headers["token"]) {
    const valid = authService.checkAuth(req.headers["token"]);
    if (!valid.success) {
      return res.send(valid);
    }
    req.user = valid.user;
    return serviceQns
      .getQuestion(req.params.id)
      .then(results => {
        if (results[0].id) {
          if (results[0].askedby == req.user.id) {
            return serviceQns
              .deleteQuestion(req.params.id)
              .then(execute => {
                res.json(execute);
              })
              .catch(err => {
                res.json(errorMsg.error(err, "Fail to delete question. try again later. "));
              });
          } else {
            res.json(errorMsg.info("You cannot delete question you did not post"));
          }
        } else {
          res.json(errorMsg.info("no dta found. "));
        }
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
