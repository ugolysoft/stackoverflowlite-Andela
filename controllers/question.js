
var serviceQns = require('../services/question');

function getAllQuestions(req, res){
	
}
function getQuestion (req, res){
	
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