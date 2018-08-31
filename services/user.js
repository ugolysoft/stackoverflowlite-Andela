import client from "../db";
import validator from "../services/validator";
import bcrypt from "bcrypt";

const getUserByLogin = email => {
  const query = "SELECT * FROM users_tb WHERE email=$1";
  return client.runQuery(query, [email]).then(user => {
    if (Array.isArray(user) && user.length > 0) return true;
    return false;
  });
};

const addUser = user => {
  const query =
    "INSERT INTO users_tb(name,email,password) SELECT $1, $2, $3 WHERE NOT " +
    "EXISTS(SELECT id FROM users_tb WHERE email=$4 LIMIT 1) RETURNING *";
  const data = [
    validator.htmlSpecialCharacter(user.name),
    validator.htmlSpecialCharacter(user.email),
    bcrypt.hashSync(user.password, 2),
    validator.htmlSpecialCharacter(user.email)
  ];
  return client.runQuery(query, data);
};

module.exports = {
  getUserByLogin,
  addUser
};
