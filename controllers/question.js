var qns = require('../json/questions.json');

function getAllQuestions(req, res){
	res.json(qns);
}

module.exports = {
    getAllQuestions
}