const client = require("../db");
const validator = require("../services/validator");

const postAnswer = answer => {
  const query =
    "INSERT INTO answers_tb(answer,questionid,answeredby) VALUES($1, $2, $3) RETURNING * ";
  const data = [
    validator.htmlSpecialCharacter(answer.body.body),
    answer.params.questionid,
    answer.user.id
  ];
  return client.runQuery(query, data).then(result => {
    return result;
  });
};

const updateAnswer = answer => {
  const query =
    "UPDATE answers_tb SET answer=$1 WHERE ansid=$2 AND answeredby=$3 RETURNING * ";
  const data = [
    validator.htmlSpecialCharacter(answer.body),
    answer.id,
    answer.userid
  ];
  return client.runQuery(query, data);
};
const vote = _vote => {
  const query =
    "INSERT INTO votes_tb(vote,ansvote,votedby) SELECT $1, $2, $3 WHERE NOT " +
    "EXISTS(SELECT voteid FROM votes_tb WHERE ansvote=$4 AND votedby=$5 LIMIT 1) RETURNING * ";
  const data = [
    _vote.body.vote,
    _vote.params.id,
    _vote.user.id,
    _vote.params.id,
    _vote.user.id
  ];
  return client.runQuery(query, data).then(result => {
    return result;
  });
};

const addComment = comment => {
  const query =
    "INSERT INTO comments_tb(message, anscomment, commentedby) VALUES($1, $2, $3) RETURNING * ";
  const data = [validator.htmlSpecialCharacter(comment.body.body), comment.params.id, comment.user.id];
  return client.runQuery(query, data).then(result => {
    return result;
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

const comments = questionid => {
  const query = `SELECT a.*,b.name FROM comments_tb a INNER JOIN users_tb b ON a.commentedby=b.id WHERE 
    anscomment IN (SELECT ansid FROM answers_tb WHERE questionid=$1)`;
  return client.runQuery(query, [questionid]).then(comments => {
    return comments;
  });
};
module.exports = {
  postAnswer,
  vote,
  acceptedAnswer,
  addComment,
  comments,
  updateAnswer
};
