
var serviceQns = require('../services/question.js');

function getAllQuestions(req, res){
	serviceQns.getAllQuestions(req, res);
}
function getQuestion (req, res){
	serviceQns.getQuestion(req, res);
}

function postQuestion(req, res){
	serviceQns.postQuestion(req, res);
}

function deleteQuestion(req, res){
	serviceQns.deleteQuestion(req, res);
}

module.exports = {
    getAllQuestions,
	getQuestion,
	postQuestion
}