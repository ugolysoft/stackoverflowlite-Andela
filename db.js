const pg = require("pg");
const con = process.env.DATABASE_URL || "postgresql://postgres:ugowoo@localhost:3500/stackdb";
const client = new pg.Client(con);
client.connect();

function runQuery(querystring, data = []) {
  return client.query(querystring, data).then(res => {
    /*var cmd = querystring.split(" ")[0].toLowerCase();
    if (cmd == "select") {
      return res.rows;
    }*/
    return res.rows;
  });
}

function userTB() {
  let query =
    "CREATE TABLE votes(id SERIAL PRIMARY KEY, vote integer NOT NULL, answerid integer NOT NULL, " +
    " votedate DATE DEFAULT CURRENT_DATE NOT NULL, votedby integer NOT NULL)";
  return runQuery(query)
    .then(res => {
      query =
        "CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) " +
        "NOT NULL UNIQUE, password VARCHAR(100) NOT NULL)";
      return runQuery(query);
    })
    .then(res => {
      query =
        "CREATE TABLE questions(id SERIAL PRIMARY KEY, title VARCHAR(80) NOT NULL, body TEXT NOT NULL, askedby INTEGER NOT NULL, " +
        "askedate DATE DEFAULT CURRENT_DATE)";
      return runQuery(query);
    })
    .then(res => {
      query =
        "CREATE TABLE answers(id SERIAL PRIMARY KEY, body TEXT NOT NULL, answeredby INTEGER NOT NULL, " +
        "ansdate DATE DEFAULT CURRENT_DATE, questionid INTEGER NOT NULL)";
      return runQuery(query);
    })
    .catch(err => {
      //console.log(err);
    });
}

module.exports = {
  runQuery,
  userTB
};
