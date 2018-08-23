
var service = require('../services/answer');

function postAnswer(req, res){
	if(req.body.body !== '' && req.params.questionid !== ''){
		var enq = {
			body: req.body.body,
			userid: req.user.id,
			questionid: req.params.questionid
		};
		return service.postAnswer(enq)
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
				   message: 'Fail to save answer. try again later. ' 
			  });
			  
		 });
	}
	res.send({
		success: false,
		message: 'Question body must not be empty.' 
	});
}



module.exports = {
    postAnswer
}