const client = require("../db");

const postAnswer = params => {
  const query = "INSERT INTO answers(body,questionid,answeredby) VALUES($1, $2, $3) RETURNING * ";
  const data = [params.body.body, params.params.questionid, params.user.id];
  return client.runQuery(query, data).then(user => {
    return user;
  });
};

module.exports = {
  postAnswer
};
