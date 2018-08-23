const Sequelize = require('sequelize');
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
 }