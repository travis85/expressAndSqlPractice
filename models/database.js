const dotenv = require('dotenv')
dotenv.config()
//SETTING UP HOW SEQUELIZE TALKS TO DATABASE(SQL) AND OUR SERVER(EXPRESS)
const { Sequelize } = require('sequelize')
const database = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_NAME}`);

module.exports = database