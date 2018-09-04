const express = require( "express");
const bodyParser = require( "body-parser");

const qns = require( "./controllers/question");
const auth = require( "./controllers/auth");
const ans = require( "./controllers/answer");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/api/v1/questions", qns.getAllQuestions);

router.get("/api/v1/questions/:id", qns.getQuestion);

router.get("/api/v1/users/questions", qns.myQuestions);
router.get("/api/v1/questions/:questionid/answers/comments", ans.comments);

router.post("/api/v1/questions", qns.postQuestion);

router.post("/api/v1/questions/:questionid/answers", ans.postAnswer);

router.post("/api/v1/auth/signup", auth.register);

router.post("/api/v1/users/data", auth.userData);

router.post("/api/v1/auth/login", auth.login);

router.post("/api/v1/questions/answers/votes/:id", ans.vote);

router.post("/api/v1/questions/answers/comments/:id", ans.comment);




router.post("/api/v1/questions/search", qns.search);

router.put("/api/v1/questions/answers/:id",ans.updateAnswer);

router.put("/api/v1/questions/:questionid/answers/:answerid", ans.acceptedAnswer);

router.delete("/api/v1/questions/:id", qns.deleteQuestion);

module.exports = router;
