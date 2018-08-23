const User = require('../models').User;

const getUserByLogin = params => {
      return User.findOne({
          where: {
              email: params
          }
     })
}

const addUser = params =>{
	return User.create({
		name: params.name,
		password: params.password,
		email: params.email
		});
}


module.exports = {
    getUserByLogin,
	addUser
}