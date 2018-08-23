const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models').User;
const authenticate = params => {
      return Users.findOne({
          where: {
              email: params.email
          },
          raw: true
     }).then(user => {
          if (!user)
              throw new Error('Authentication failed. User not found.');
          if (!bcrypt.compareSync(params.password || '', user.password))
              throw new Error('Authentication failed. Wrong password.');
          const payload = {
              email: user.email,
              id: user.id,
              time: new Date()
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