const Sequelize = require('sequelize');
const postgreSQL = new Sequelize('stackoverflowlite', 'postgres', 'ugowoo', {
  host: 'localhost',
  port: '3500',
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

require('sequelize-values')(postgreSQL);
module.exports = postgreSQL;