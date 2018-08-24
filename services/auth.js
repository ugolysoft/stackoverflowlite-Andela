const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db');
const authenticate = params => {
	const query = 'SELECT * FROM users WHERE email=$1';
	const data = [params.email];
	return client.runQuery(query, data).then(user=>{
		if (!user)
            throw new Error('Authentication failed. User not found.');
        if (!bcrypt.compareSync(params.password || '', user[0].password))
            throw new Error('Authentication failed. Wrong password.');
        const payload = {
            email: user[0].email,
            id: user[0].id,
            time: new Date(),
			name: user[0].name
        };
        var token = jwt.sign(payload, 'yo-its-a-secret', {
            expiresIn: '6h'
        });
        return token;
	});
      
}


module.exports = {
    authenticate
}