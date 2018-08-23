const client = require('../db');

const postQuestion = params =>{
	const query = 'INSERT INTO questions(title,body,askedby) VALUES($1, $2, $3)';
	const data = [params.body.title,params.body.body,params.user.id];
	return client.runQuery(query, data).then(user=>{
        return user;
	});
}


module.exports = {
	
	postQuestion
}