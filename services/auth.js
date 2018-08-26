const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db");

const authenticate = params => {
  const query = "SELECT * FROM users WHERE email=$1";
  const data = [params.email];
  return client.runQuery(query, data).then(user => {
    if (Array.isArray(user) && user.length > 0) {
      if (!bcrypt.compareSync(params.password || "", user[0].password))
        return { success: false, message: "Wrong password" };
      const payload = {
        name: user[0].name,
        email: user[0].email,
        id: user[0].id,
        time: new Date()
      };
      return {
        success: true,
        token: jwt.sign(payload, "make-me-screet", {
          expiresIn: "2h"
        })
      };
    }
    return { success: false, message: "Wrong email address" };
  });
};

const checkAuth = param => {
  return jwt.verify(param, "make-me-screet", (err, decoded) => {
    if (err) {
      return { success: false, message: "Operation failed. Failed to authenticate token." };
    }

    let code = {
      email: decoded.email,
      id: decoded.id,
      name: decoded.name
    };
    return { success: true, message: "valide token", user: code };
  });
};

module.exports = {
  checkAuth,
  authenticate
};
