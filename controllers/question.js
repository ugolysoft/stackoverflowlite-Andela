const serviceQns = require("../services/question");
const message = require("../services/message");
const authService = require("../services/auth");
const validator = require("../services/validator");

const getAllQuestions = (req, res) => {
  return serviceQns
    .allQuestions()
    .then(results => {
      res.send(message.info("", true, results));
    })
    .catch(err => {
      res.send(message.error(err));
    });
};

const getQuestion = (req, res) => {
  if (validator.validDatatype(req.params.id)) {
    return serviceQns
      .getQuestion(req.params.id)
      .then(results => {
        if (results.length > 0) {
          let ans = [];
          for (var value of results) {
            if (value.answer != null && value.answer != "") {
              ans.push({
                answer: value.answer,
                answeredby: value.ansby,
                createddate: value.ansdate,
                id: value.ansid,
                votes: value.vote,
                userid : value.answeredby
              });
            }
          }
          let qns = {
            title: results[0].title,
            question: results[0].question,
            askeddby: results[0].name,
            createddate: results[0].askedate,
            id: results[0].qnsid,
            answers: ans
          };
          return res.send(message.info("questions fetched", true, qns));
        }
        return res.send(message.info("No data found", true));
      })
      .catch(err => {
        res.send(message.error(err));
      });
  }
  return res.send(message.info("Operation failed. Wrong data type; integer required"));
};

const myQuestions = (req, res) => {
  if (authService.checkAuth(req)) {
    return serviceQns
      .myQuestions(req.user.id)
      .then(execute => {
        res.send(execute);
      })
      .catch(err => {
        res.send(message.error(err));
      });
  }
  return res.send(message.info("Operation failed. Access denied"));
};

const postQuestion = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.checkValidInputes(req.body,["body", "title"])) {
      return serviceQns
        .postQuestion(req)
        .then(question => {
          if (question.length > 0) return res.send(message.info("Question saved", true, question[0]));
          return res.send(message.info("You have asked a question with this title"));
        })
        .catch(err => {
          res.send(message.error(err));
        });
    }
    return res.send(message.info(req.body.data));
  }
  return res.send(message.info("Operation failed. Access denied"));
};

const search = (req, res) => {
  if (validator.notEmpty(req.body.search)) {
    return serviceQns
      .search(req.body.search)
      .then(results => {
        res.send(results);
      })
      .catch(err => {
        res.send(message.error(err));
      });
  }
  return res.send(message.info("Operation failed. Search field is empty"));
};


const deleteQuestion = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.validDatatype(req.params.id)) {
      return serviceQns
        .deleteQuestion(req.params.id, req.user.id)
        .then(execute => {
          if (execute.length > 0) res.send(message.info("Operation was successful", true, execute));
          else
            res.send(message.info("Operation failed. You cannot delete question you did not post"));
        })
        .catch(err => {
          res.send(message.error(err));
        });
    }
    return res.send(message.info("Operation failed. Wrong datatype integer required"));
  }
  return res.send(message.info("Operation failed. Access denied"));
};

module.exports = {
  getAllQuestions,
  getQuestion,
  postQuestion,
  deleteQuestion,
  search,
  myQuestions
};
