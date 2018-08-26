var express = require("express");
var bodyParser = require("body-parser");

var qns = require("./controllers/question");
var auth = require("./controllers/auth");
var ans = require("./controllers/answer");

var mdwear = require("./controllers/middlewares");

const client = require("./db");

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

setTimeout(() => {
  client.userTB();
}, 200);

router.get("/api/v1/questions", qns.getAllQuestions);

router.get("/api/v1/questions/:id", qns.getQuestion);

router.post("/api/v1/questions", qns.postQuestion);

router.delete("/api/v1/questions/:id");

router.post("/api/v1/questions/:questionid/answers", ans.postAnswer);

router.post("/api/v1/register", auth.register);

router.post("/api/v1/login", auth.login);

router.put("/api/v1/questions/:id", mdwear.checkAuth, qns.updateQuestion);

router.delete("/api/v1/questions/:id", qns.deleteQuestion);

module.exports = router;
