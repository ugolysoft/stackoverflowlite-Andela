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

/*

//GET A SINGLE QUESTION WITH USER THAT ASK THE QUESTION
router.get('/api/v1/questions/:id', (req, res)=>{
	if(req.params.id){
		let _qns = [];
		let index = qns.findIndex(x=>x.id === req.params.id);
		if(index > -1){
			let i = users.findIndex((x)=>x.id === qns[index].userid);
			let name = users[i].name || '';
			_qns.push({
				title: qns[index].title,
				body: qns[index].body,
				date: qns[index].date,
				time: qns[index].time,
				user: name
			});
		}
		res.json(_qns);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
	
});

//GET QUESTIONS ALONG WITH ITS ANSWERS
router.get('/api/v1/questions/:questionid/answers', (req, res)=>{
	if(req.params.questionid){
		let result = [];
		let _ans = ans.filter(x=>x.questionid === req.params.questionid);
		if(_ans.length > 0){
			let qindex = qns.findIndex((x)=>x.id === req.params.questionid);
			let index = users.findIndex((x)=>x.id === qns[qindex].userid);
			result.push({
				title: valueOrEmpty(qns[qindex].title),
				question: valueOrEmpty(qns[qindex].body),
				date: valueOrEmpty(qns[qindex].date),
				time: valueOrEmpty(qns[qindex].time),
				user: valueOrEmpty(users[index].name),
				answers: _ans
			});
		}
		res.json(result);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
	
});


function valueOrEmpty(value, empty = ''){
	return value || empty;
}

//SAVE A QUESTION
router.post('/api/v1/questions', (req, res)=>{
	if(req.body.id && req.body.title && req.body.body && req.body.date && req.body.time && req.body.userid){
		qns.push(req.body);
		res.json(qns);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
});

//SAVE AN ANSWER TO A QUESTION
router.post('/api/v1/questions/:questionid/answers', (req, res)=>{
	if(req.body.id  && req.body.body && req.body.date && req.body.time && req.body.userid && req.params.questionid){
		let _ans = {
			id: req.body.id,
			body: req.body.body,
			userid: req.body.userid,
			date: req.body.date,
			time: req.body.time,
			questionid: req.params.questionid
		};
		ans.push(_ans);
		res.json(ans);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
});

//UPDATE A QUESTION (BODY OR TITLE OR BOTH)
router.put('/api/v1/questions/:id', (req, res)=>{
	if(req.params.id && (req.body.title || req.body.body)){
		let index = qns.findIndex((x)=>x.id === req.params.id);
		if(index > -1){
			qns[index].title = valueOrEmpty(req.body.title, qns[index].title);
			qns[index].body = valueOrEmpty(req.body.body, qns[index].body);
		}
		res.json(qns);
	}else{
		res.json(500, {error: 'There was an error!'});
	}
});

//DELETE A QUESTION
router.delete('/api/v1/questions/:id', (req, res)=>{
	var indexToDel = -1;
	indexToDel = qns.findIndex((x)=>x.id === req.params.id);
	if(~indexToDel){
		qns.splice(indexToDel, 1);
	}
	res.json(qns);
});

*/

module.exports = router;