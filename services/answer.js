const client = require("../db");

const postAnswer = params => {
  const query =
    "INSERT INTO answers_tb(answer,questionid,answeredby) VALUES($1, $2, $3) RETURNING * ";
  const data = [params.body.body, params.params.questionid, params.user.id];
  return client.runQuery(query, data).then(user => {
    return user;
  });
};
const vote = params => {
  const query =
    "INSERT INTO votes_tb(vote,ansvote,votedby) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT voteid FROM votes_tb WHERE ansvote=$4 AND votedby=$5 LIMIT 1) RETURNING * ";
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

const addComment = params => {
  const query =
    "INSERT INTO comments_tb(message, anscomment, commentedby) VALUES($1, $2, $3) RETURNING * ";
  const data = [params.body.body, params.params.id, params.user.id];
  return client.runQuery(query, data).then(comment => {
    return comment;
  });
};

const acceptedAnswer = (questionid, answereid) => {
  const query =
    "UPDATE questions_tb SET preferred=(SELECT ansid FROM answers_tb WHERE qnsid=$1 AND ansid=$2) WHERE qnsid=$3 RETURNING * ";
  const data = [questionid, answereid, questionid];
  return client.runQuery(query, data).then(user => {
    return user;
  });
};
module.exports = {
  postAnswer,
  vote,
  acceptedAnswer,
  addComment
};
