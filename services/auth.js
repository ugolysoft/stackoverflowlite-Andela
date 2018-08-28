const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db");

const authenticate = params => {
  const query = "SELECT * FROM users_tb WHERE email=$1";
  const data = [params.email];
  return client.runQuery(query, data).then(user => {
    if (Array.isArray(user) && user.length > 0) {
      if (!bcrypt.compareSync(params.password || "", user[0].password))
        return { success: false, message: "Wrong password" };
      const userData = {
        name: user[0].name,
        email: user[0].email,
        id: user[0].id,
        time: new Date()
      };
      return {
        success: true,
        token: jwt.sign(userData, "make-me-screet", {
          expiresIn: "2h"
        })
      };
    }
    return { success: false, message: "Wrong email address" };
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
