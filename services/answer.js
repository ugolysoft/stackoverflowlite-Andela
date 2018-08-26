const client = require("../db");

const postAnswer = params => {
  const query = "INSERT INTO answers(body,questionid,answeredby) VALUES($1, $2, $3) RETURNING * ";
  const data = [params.body.body, params.params.questionid, params.user.id];
  return client.runQuery(query, data).then(user => {
    return user;
  });
};
const vote = params => {
  const query =
    "INSERT INTO votes(vote,answerid,votedby) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT id FROM votes " +
    "WHERE answerid=$4 AND votedby=$5) RETURNING * ";
  const data = [
    params.body.vote,
    params.params.id,
    params.user.id,
    params.params.id,
    params.user.id
  ];
  return client.runQuery(query, data).then(user => {
    return user;
  });
};
module.exports = {
  postAnswer,
  vote
};
