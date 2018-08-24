const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authService = require('../services/auth');
const userService = require('../services/user');
function login(req, res){
     return authService.authenticate(req.body)
     .then(token => {
          res.send({
               success: true,
               data: { token }
          });
     })
     .catch(err => {
          res.send({
               success: false,
               message: 'Wrong email or password' //err.message
          });
		  
     });
	 
};


function register(req, res){
     var email = req.body.email;
     return userService.getUserByLogin(req.body.email)
     .then(exists => {
         if (exists){
		   return res.send({
			   success: false,
			   message: `Registration failed. User with this email '${email}' already registered.`
		   });
         }
          var user = {
               email: req.body.email,
               password: bcrypt.hashSync(req.body.password, 2),
			   name: req.body.name
           }
        return userService.addUser(user)
		.then(() => res.send({success: true}))
		.catch(err => {
			res.status(400).send({ success: false, error: err });
		});
     });
	 
	 
};


module.exports = {
    login,
	register
}