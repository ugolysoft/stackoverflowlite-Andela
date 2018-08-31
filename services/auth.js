const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db");
const errorMsg = require("../services/error");

const authenticate = data => {
  const query = "SELECT * FROM users_tb WHERE email=$1";
  return client.runQuery(query, [data.email]).then(user => {
    if (Array.isArray(user) && user.length > 0) {
      if (!bcrypt.compareSync(data.password || "", user[0].password))
        return errorMsg.info("Wrong password");
      const userData = {
        name: user[0].name,
        email: user[0].email,
        id: user[0].id,
        time: new Date()
      };
      return {
        success: true,
        message: "You have successfully login",
        token: jwt.sign(userData, "make-me-screet", {
          expiresIn: "2h"
        }),
        data: "Token expired in 2 hours"
      };
    }
    return errorMsg.info("Wrong email address");
  });
};

const checkAuth = req => {
  var token = req.headers["token"];
  if (!token) return false;

  return jwt.verify(token, "make-me-screet", (err, decoded) => {
    if (err) {
      return false;
    }

    req.user = {
      email: decoded.email,
      id: decoded.id,
      name: decoded.name
    };
    return true;
  });
};

module.exports = {
  checkAuth,
  authenticate
};
