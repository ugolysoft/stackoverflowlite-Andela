const serviceQns = require( "../services/question");
const errorMsg = require( "../services/error");
const authService = require( "../services/auth");
const validator = require( "../services/validator");

const getAllQuestions = (req, res) => {
  return serviceQns
    .allQuestions()
    .then(results => {
      res.send(errorMsg.info("", true, results));
    })
    .catch(err => {
      res.send(errorMsg.error(err));
    });
};

const getQuestion = (req, res) => {
  if (validator.validDatatype(req.params.id)) {
    return serviceQns
      .getQuestion(req.params.id)
      .then(results => {
        //res.send(results);

        if (results.length > 0) {
          let ans = [],
            qns = {};
          for (var value of results) {
            qns = {
              title: value.title,
              question: value.question,
              askeddby: value.name,
              createddate: value.askedate,
              id: value.qnsid
            };
            if (value.answer != null && value.answer != "") {
              ans.push({
                answer: value.answer,
                answeredby: value.answeredby,
                createddate: value.ansdate,
                id: value.ansid,
                votes: value.vote
              });
            }
          }
          res.send(errorMsg.info("", true, { question: qns, answers: ans }));
        }
        res.send(errorMsg.info("No data found", true));
      })
      .catch(err => {
        res.send(errorMsg.error(err));
      });
  }
  return res.send(errorMsg.info("Operation failed. Wrong data type; integer required"));
};

const answerComments = value => {
  let comment = [];
  if (Array.isArray(value)) {
    for (var val of value) {
      let c = val.split("$*%");
      comment.push({
        name: c[1],
        message: c[0],
        date: c[2]
      });
    }
  }
  return comment;
};

const myQuestions = (req, res) => {
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
  return res.send(errorMsg.info("Operation failed. Access denied"));
};

const postQuestion = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.checkValidInputes(req.body)) {
      return serviceQns
        .postQuestion(req)
        .then(question => {
          if (question.length > 0) return res.send(errorMsg.info("Question saved", true, question));
          return res.send(errorMsg.info("You have asked a question with this title"));
        })
        .catch(err => {
          res.send(errorMsg.error(err));
        });
    }
    return res.send(errorMsg.info(req.body.data));
  }
  return res.send(errorMsg.info("Operation failed. Access denied"));
};

const search = (req, res) => {
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
};

const updateQuestion = (req, res) => {
  if (authService.checkAuth(req)) {
    let data = {
      id: req.params.id,
      body: req.body.body,
      title: req.body.title,
      userid: req.user.id
    };
    if (validator.checkValidInputes(data)) {
      return serviceQns
        .updateQuestion(data)
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
    return res.send(errorMsg.info(data.data));
  }
  return res.send(errorMsg.info("Operation failed. Access denied"));
};

const deleteQuestion = (req, res) => {
  if (authService.checkAuth(req)) {
    if (validator.validDatatype(req.params.id)) {
      return serviceQns
        .deleteQuestion(req.params.id, req.user.id)
        .then(execute => {
          if (execute.length > 0)
            res.send(errorMsg.info("Operation was successful", true, execute));
          else
            res.send(
              errorMsg.info("Operation failed. You cannot delete question you did not post")
            );
        })
        .catch(err => {
          res.send(errorMsg.error(err));
        });
    }
    return res.send(errorMsg.info("Operation failed. Wrong datatype integer required"));
  }
  return res.send(errorMsg.info("Operation failed. Access denied"));
};

module.exports = {
  getAllQuestions,
  getQuestion,
  postQuestion,
  updateQuestion,
  deleteQuestion,
  search,
  myQuestions
};
