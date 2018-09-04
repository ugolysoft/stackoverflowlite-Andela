const client = require("../db");
const validator = require("../services/validator");

const postQuestion = question => {
  const query =
    "INSERT INTO questions_tb(title,question,askedby) SELECT $1, $2, $3 WHERE NOT " +
    "EXISTS(SELECT qnsid FROM questions_tb WHERE title=$4 AND askedby=$5 LIMIT 1) RETURNING *";
  const data = [
    validator.htmlSpecialCharacter(question.body.title),
    validator.htmlSpecialCharacter(question.body.body),
    parseInt(question.user.id),
    validator.htmlSpecialCharacter(question.body.title),
    parseInt(question.user.id)
  ];
  return client.runQuery(query, data);
};
const getQuestion = questionid => {
  const query = `SELECT a.*,c.name,b.*, x.name AS ansby, (SELECT SUM(vote) FROM votes_tb WHERE ansvote=b.ansid) AS vote 
    FROM questions_tb a LEFT JOIN (answers_tb b INNER JOIN users_tb x ON x.id=b.answeredby) ON a.qnsid=b.questionid 
    INNER JOIN users_tb c ON (c.id=a.askedby) WHERE a.qnsid=$1`;
  return client.runQuery(query, [questionid]);
};

const allQuestions = (option = "", data = []) => {
  const query = `SELECT a.title,a.qnsid,a.askedate,b.name, (SELECT COUNT(ansid) FROM answers_tb WHERE questionid=a.qnsid) AS ans 
  FROM questions_tb a INNER JOIN users_tb b ON (b.id=a.askedby) ${option}  ORDER BY ans DESC`;
  return client.runQuery(query, data);
};

const myQuestions = userid => {
  query = `(SELECT title,askedate,qnsid, (SELECT COUNT(qnsid) FROM questions_tb WHERE askedby=$1) AS totalquestions
  FROM questions_tb WHERE askedby=$2 ORDER BY qnsid DESC) UNION (SELECT '' AS title,CURRENT_DATE AS askedate,0 AS qnsid,
   (SELECT COUNT(ansid) FROM answers_tb WHERE answeredby=$3) AS totalquestions FROM answers_tb WHERE answeredby=$4)`;
  return client.runQuery(query, [
    userid,userid,userid,userid
  ]);
};

const search = searchtext => {
  return allQuestions(" WHERE to_tsvector(a.title) @@ plainto_tsquery($1) ", [searchtext]);
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
  deleteQuestion,
  search,
  myQuestions
};
