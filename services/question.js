const client = require("../db");

const postQuestion = params => {
  const query = "INSERT INTO questions(title,body,askedby) VALUES($1, $2, $3) RETURNING * ";
  const data = [params.body.title, params.body.body, params.user.id];
  return client.runQuery(query, data);
};
const getQuestion = params => {
  const query =
    "SELECT a.*,c.name,b.body AS ans, b.id AS ansid, b.ansdate, x.name AS ansby, " +
    "(SELECT SUM(vote) FROM votes WHERE answerid=b.id) AS vote FROM questions a LEFT JOIN " +
    "(answers b INNER JOIN users x ON x.id=b.answeredby) ON a.id=b.questionid INNER JOIN users c ON (c.id=a.askedby) WHERE a.id=$1";
  const data = [params];
  return client.runQuery(query, data);
};

const allQuestions = params => {
  const query = "SELECT a.*,b.name FROM questions a INNER JOIN users b ON (b.id=a.askedby)";
  return client.runQuery(query);
};

const updateQuestion = params => {
  const query = "UPDATE questions SET body=$1,title=$2 WHERE id=$3 RETURNING * ";
  const data = [params.body, params.title, params.id];
  return client.runQuery(query, data);
};

const deleteQuestion = params => {
  const query = "DELETE FROM questions WHERE id=$1 RETURNING *";
  const data = [params];
  return client.runQuery(query, data);
};

module.exports = {
  allQuestions,
  postQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion
};
