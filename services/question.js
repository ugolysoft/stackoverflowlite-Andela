var qns = require('../json/questions.json');

function getQuestion(req, res){
	if(req.params.id){
		let _qns = [];
		let index = qns.findIndex(x=>x.id === req.params.id);
		if(index > -1){
			_qns.push(qns[index]);
		}
		res.json(_qns);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
	
}
function getAllQuestions(req, res){
	res.json(qns);
}

module.exports = {
	getQuestion,
	getAllQuestions
}