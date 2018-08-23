const client = require('../db');

const postQuestion = params =>{
	const query = 'INSERT INTO questions(title,body,askedby) VALUES($1, $2, $3)';
	const data = [params.body.title,params.body.body,params.user.id];
	return client.runQuery(query, data);
}

const getQuestion = params => {
	const query = 'SELECT a.*,c.name,b.body AS ans, b.id AS ansid FROM questions a '+
	'LEFT JOIN answers b ON (a.id=b.questionid) INNER JOIN users c ON (c.id=a.askedby) WHERE a.id=$1';
	const data = [params];
	return client.runQuery(query, data);
}

const allQuestions= params => {
	const query = 'SELECT a.*,b.name FROM questions a INNER JOIN users b ON (b.id=a.askedby)';
	return client.runQuery(query);
}

const updateQuestion = params => {
	const query = 'UPDATE questions SET body=$1,title=$2 WHERE id=$3';
	const data = [params.body, params.title, params.id];
	return client.runQuery(query, data);
}

module.exports = {
	allQuestions,
	postQuestion,
	getQuestion,
	updateQuestion
}