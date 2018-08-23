var express = require('express');
var bodyParser = require('body-parser');

var qns = require('./controllers/question');
var auth = require('./controllers/auth');

var mdwear = require('./controllers/middlewares');

var router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());


//GET ALL QUESTIONS
router.get('/api/v1/questions', qns.getAllQuestions);



//GET A SINGLE QUESTION WITH USER THAT ASK THE QUESTION
router.get('/api/v1/questions/:id', qns.getQuestion);

//SAVE A QUESTION
router.post('/api/v1/questions', mdwear.checkAuth, qns.postQuestion);

//DELETE A QUESTION
router.delete('/api/v1/questions/:id', );


//REGISTER USER
router.post('/api/v1/register', auth.register);

//SIGNUP USER
router.post('/api/v1/login', auth.login);

module.exports = router;