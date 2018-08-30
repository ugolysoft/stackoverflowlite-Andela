var express = require("express");
var bodyParser = require("body-parser");

var qns = require("./controllers/question");
var auth = require("./controllers/auth");
var ans = require("./controllers/answer");

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "false");

  next();
});

router.get("/api/v1/questions", qns.getAllQuestions);

router.get("/api/v1/questions/:id", qns.getQuestion);

router.get("/api/v1/users/questions", qns.myQuestions);

router.post("/api/v1/questions", qns.postQuestion);

router.delete("/api/v1/questions/:id");

router.post("/api/v1/questions/:questionid/answers", ans.postAnswer);

router.post("/api/v1/auth/signup", auth.register);

router.post("/api/v1/auth/login", auth.login);

router.post("/api/v1/questions/answers/votes/:id", ans.vote);

router.post("/api/v1/questions/answers/comments/:id", ans.comment);

router.post("/api/v1/questions/search", qns.search);

router.put("/api/v1/questions/:id", qns.updateQuestion);

router.put("/api/v1/questions/:questionid/answers/:answerid", ans.acceptedAnswer);

router.delete("/api/v1/questions/:id", qns.deleteQuestion);

module.exports = router;
