
var serviceQns = require('../services/question');

function getAllQuestions(req, res){
	return serviceQns.allQuestions()
	.then(results => {
          res.send(results);
     })
	.catch(err=> {
		console.log(err);
          res.send({
               success: false,
               message: 'Operation failed. try again later. ' 
          });
	})
}
function getQuestion (req, res){
	return serviceQns.getQuestion(req.params.id)
	.then(results => {
          res.send(results);
     })
	.catch(err=> {
		console.log(err);
          res.send({
               success: false,
               message: 'Operation failed. try again later. ' 
          });
	})
}

function postQuestion(req, res){
	return serviceQns.postQuestion(req)
     .then(execute => {
          res.send({
               success: true,
               data: "Operation was successful"
          });
     })
     .catch(err => {
		 console.log(err);
          res.send({
               success: false,
               message: 'Fail to save question. try again later. ' 
          });
		  
     });
}

function deleteQuestion(req, res){
	
}

module.exports = {
    getAllQuestions,
	getQuestion,
	postQuestion
}