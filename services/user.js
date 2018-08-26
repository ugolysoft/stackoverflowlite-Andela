const client = require("../db");

const getUserByLogin = params => {
  const query = "SELECT * FROM users WHERE email=$1";
  const data = [params];
  return client.runQuery(query, data).then(user => {
    if (Array.isArray(user) && user.length > 0) return true;
    return false;
  });
};

const addUser = params => {
  const query = "INSERT INTO users(name,email,password) VALUES($1, $2, $3) RETURNING *";
  const data = [params.name, params.email, params.password];
  return client.runQuery(query, data);
};

module.exports = {
  getUserByLogin,
  addUser
};
