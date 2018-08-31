import client from "../db";
import validator from "../services/validator";

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
  const query = `SELECT a.*,c.name,b.*, x.name AS ansby, (SELECT SUM(vote) FROM votes_tb WHERE ansvote=b.ansid) AS vote , 
    (SELECT ARRAY_AGG(CONCAT_WS('$*%',z.message,y.name,z.commentdate)) FROM comments_tb z INNER JOIN users_tb y ON y.id=z.commentedby  
    WHERE z.anscomment=b.ansid) AS comments FROM questions_tb a LEFT JOIN (answers_tb b INNER JOIN users_tb x ON x.id=b.answeredby) ON a.qnsid=b.questionid 
    INNER JOIN users_tb c ON (c.id=a.askedby) WHERE a.qnsid=$1`;
  return client.runQuery(query, [questionid]);
};

const allQuestions = (option = "", data = []) => {
  const query = `SELECT a.title,a.qnsid,a.askedate,b.name, (SELECT COUNT(ansid) FROM answers_tb WHERE questionid=a.qnsid) AS ans 
  FROM questions_tb a INNER JOIN users_tb b ON (b.id=a.askedby) ${option}  ORDER BY ans DESC`;
  return client.runQuery(query, data);
};

const myQuestions = userid => {
  return client.runQuery("SELECT title,askedate,qnsid FROM questions_tb WHERE askedby=$1", [
    userid
  ]);
};

const search = searchtext => {
  return allQuestions(" WHERE to_tsvector(a.title) @@ plainto_tsquery($1) ", [searchtext]);
};

const updateQuestion = question => {
  const query =
    "UPDATE questions_tb SET question=$1,title=$2 WHERE qnsid=$3 AND askedby=$4 RETURNING * ";
  const data = [
    validator.htmlSpecialCharacter(question.body),
    validator.htmlSpecialCharacter(question.title),
    question.id,
    question.userid
  ];
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
  search,
  myQuestions
};
