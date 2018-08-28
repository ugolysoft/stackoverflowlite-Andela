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
    "CREATE TABLE users_tb(id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) " +
    "NOT NULL UNIQUE, password VARCHAR(100) NOT NULL)";
  return runQuery(query)
    .then(res => {
      //question
      query =
        "CREATE TABLE questions_tb(qnsid SERIAL UNIQUE NOT NULL, title VARCHAR(80) NOT NULL, question TEXT NOT NULL, preferred INTEGER," +
        " askedby INTEGER REFERENCES users_tb(id) ON DELETE CASCADE ON UPDATE CASCADE, askedate DATE DEFAULT CURRENT_DATE, PRIMARY KEY (qnsid, askedby))";
      return runQuery(query);
    })
    .then(res => {
      query =
        "CREATE TABLE answers_tb(ansid SERIAL UNIQUE NOT NULL, answer TEXT NOT NULL, answeredby INTEGER REFERENCES users_tb(id) ON DELETE CASCADE ON UPDATE CASCADE, " +
        "ansdate DATE DEFAULT CURRENT_DATE, questionid INTEGER REFERENCES questions_tb(qnsid) ON DELETE CASCADE ON UPDATE CASCADE," +
        " PRIMARY KEY (ansid,answeredby,questionid))";
      return runQuery(query);
    })
    .then(res => {
      query =
        "CREATE TABLE votes_tb(voteid SERIAL UNIQUE NOT NULL, vote integer NOT NULL, ansvote integer REFERENCES answers_tb(ansid) ON DELETE CASCADE ON UPDATE CASCADE, " +
        " votedate DATE DEFAULT CURRENT_DATE NOT NULL, votedby INTEGER REFERENCES users_tb(id) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (voteid,ansvote,votedby))";

      return runQuery(query);
    })
    .then(res => {
      query =
        "CREATE TABLE comments_tb(cmtid SERIAL UNIQUE NOT NULL, message TEXT NOT NULL, anscomment integer REFERENCES answers_tb(ansid) ON DELETE CASCADE ON UPDATE CASCADE, " +
        " commentdate DATE DEFAULT CURRENT_DATE NOT NULL, commentedby INTEGER REFERENCES users_tb(id) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (cmtid,anscomment,commentedby))";

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
