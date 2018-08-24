const client = require('../db');

const getUserByLogin = params => {
	
	const query = 'SELECT * FROM users WHERE email=$1';
	const data = [params];
	return client.runQuery(query, data).then(user=>{
		if(user && user.length > 0)
			return true;
        return false;
	});
}

const addUser = params =>{
	const query = 'INSERT INTO users(name,email,password) VALUES($1, $2, $3)';
	const data = [params.name,params.email,params.password];
	return client.runQuery(query, data).then(user=>{
        return user;
	});
}


module.exports = {
    getUserByLogin,
	addUser
}