const dotenv = require('dotenv')
dotenv.config()

const { Sequelize } = require('sequelize')
const database = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_NAME}`);

module.exports = database