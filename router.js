var express = require('express');
var bodyParser = require('body-parser');
/*var qns = require('./json/questions.json');
var ans = require('./json/answers.json');
var users = require('./json/users.json');*/

var qns = require('./controllers/question');

var router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());


//GET ALL QUESTIONS
router.get('/api/v1/questions', qns.getAllQuestions);



//GET A SINGLE QUESTION WITH USER THAT ASK THE QUESTION
router.get('/api/v1/questions/:id', qns.getQuestion);



module.exports = router;