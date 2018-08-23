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

function postQuestion(req, res){
	if(req.body.id && req.body.title && req.body.body && req.body.date && req.body.time && req.body.userid){
		qns.push(req.body);
		res.json(qns);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
}

function deleteQuestion(req, res){
	var indexToDel = -1;
	indexToDel = qns.findIndex((x)=>x.id === req.params.id);
	if(~indexToDel){
		qns.splice(indexToDel, 1);
	}
	res.json(qns);
}

module.exports = {
	getQuestion,
	getAllQuestions,
	postQuestion,
	deleteQuestion
}