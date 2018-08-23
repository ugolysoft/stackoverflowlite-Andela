
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

function updateQuestion(req, res){
	return serviceQns.getQuestion(req.params.id)
	.then(results => {
          if(results[0].id){
			  let params = {
				  id: req.params.id,
				  body: req.body.body || results[0].body,
				  title: req.body.title || results[0].title
			  };
			  return serviceQns.updateQuestion(params)
			 .then(execute => {
				  res.send(params);
			 })
			 .catch(err => {
				 console.log(err);
				  res.send({
					   success: false,
					   message: 'Fail to save question. try again later. ' 
				  });
			 });
		  }else{
			  res.send({
					success: false,
					message: 'Fail to save question. try again later. cos no question found ' 
				});
		  }
     })
}

function deleteQuestion(req, res){
	
}

module.exports = {
    getAllQuestions,
	getQuestion,
	postQuestion,
	updateQuestion
}