const client = require("../db");

const postQuestion = params => {
  const query = "INSERT INTO questions_tb(title,question,askedby) VALUES($1, $2, $3) RETURNING * ";
  const data = [params.body.title, params.body.body, parseInt(params.user.id)];
  return client.runQuery(query, data);
};
const getQuestion = params => {
  const query =
    "SELECT a.*,c.name,b.*, x.name AS ansby, (SELECT SUM(vote) FROM votes_tb WHERE ansvote=b.ansid) AS vote FROM questions_tb a LEFT JOIN " +
    "(answers_tb b INNER JOIN users_tb x ON x.id=b.answeredby) ON a.qnsid=b.questionid INNER JOIN users_tb c ON (c.id=a.askedby) WHERE a.qnsid=$1";
  const data = [params];
  return client.runQuery(query, data);
};

const allQuestions = params => {
  const query = "SELECT a.*,b.name FROM questions_tb a INNER JOIN users_tb b ON (b.id=a.askedby)";
  return client.runQuery(query);
};
const get_Question = params => {
  const query = "SELECT a.* FROM questions_tb a  WHERE a.qnsid=$1";
  const data = [params];
  return client.runQuery(query, data);
};
const updateQuestion = params => {
  const query =
    "UPDATE questions_tb SET question=$1,title=$2 WHERE qnsid=$3 AND askedby=$4 RETURNING * ";
  const data = [params.body, params.title, params.id, params.userid];
  return client.runQuery(query, data);
};

const deleteQuestion = (id, userid) => {
  const query = "DELETE FROM questions_tb WHERE qnsid=$1 AND askedby=$2 RETURNING *";
  const data = [id, userid];
  return client.runQuery(query, data);
};

module.exports = {
  allQuestions,
  postQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  get_Question
};
