const client = require('../db');

const createUserTB = ()=>{
	const query = client.query(
		'CREATE TABLE newusers(id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(100) NOT NULL)'
	).then('/', ()=>{ 
		client.query( 'CREATE TABLE newquestions(id SERIAL PRIMARY KEY, body TEXT NOT NULL, title VARCHAR(50) NOT NULL, askedby INTEGER, askeddate DATE DEFAULT CURRENT_DATE)');
	}).then('', ()=>{
		client.query(
			'CREATE TABLE newanswers(id SERIAL PRIMARY KEY, body TEXT NOT NULL, questionid INTEGER, answeredby INTEGER, ansdate DATE DEFAULT CURRENT_DATE)'
		);
	})
	.catch(err=> console.log(err));
}

/*const createQuestionTB = ()=>{
	const query = client.query(
		'CREATE TABLE questions(id SERIAL PRIMARY KEY, body TEXT NOT NULL, title VARCHAR(50) NOT NULL, askedby INTEGER, askeddate DATE DEFAULT CURRENT_DATE)'
	);
	query.then('end', ()=>{ client.end(); }).catch(err=> console.log(err));
}

const createAnswerTB = ()=>{
	const query = client.query(
		'CREATE TABLE answers(id SERIAL PRIMARY KEY, body TEXT NOT NULL, questionid INTEGER, answeredby INTEGER, ansdate DATE DEFAULT CURRENT_DATE)'
	);
	query.then('end', ()=>{ client.end(); }).catch(err=> console.log(err));
}*/

module.exports = {
     createUserTB
 }

/*const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('users', {
    name: Sequelize.STRING,
    password: Sequelize.STRING,
	email: {type: Sequelize.STRING, allowNull: false, unique: true },
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true}
});

const Question = db.define('questions', {
	 id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
     title: { type: Sequelize.STRING, allowNull: false },
	 body: { type: Sequelize.STRING, allowNull: false },
     askeddate: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW
      },
     askedby: {
         type: Sequelize.INTEGER,
         references: {
              model: User,
              key: 'id'
          }
      }
 });
 
 const Answer = db.define('answers', {
	 id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	 body: { type: Sequelize.STRING, allowNull: false },
     askeddate: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW
      },
     answeredby: {
         type: Sequelize.INTEGER,
         references: {
              model: User,
              key: 'id'
          }
      },
	  questionid: {
         type: Sequelize.INTEGER,
         references: {
              model: Question,
              key: 'id'
          }
      }
 });

User.hasMany(Question, {foreignKey: 'askedby'});
User.hasMany(Answer, {foreignKey: 'answeredby'});
Question.hasMany(Answer, {foreignKey: 'questionid'});

//db.sync().then(console.log);
module.exports = {
     User,
     Question,
	 Answer
 }*/