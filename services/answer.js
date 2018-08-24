const client = require('../db');

const postAnswer = params =>{
	const query = 'INSERT INTO answers(body,questionid,answeredby) VALUES($1, $2, $3)';
	const data = [params.body,params.questionid,params.userid];
	return client.runQuery(query, data).then(user=>{
        return user;
	});
}


module.exports = {
	
	postAnswer
}