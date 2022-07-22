const database = require('./database')
const { DataTypes, Model } = require('sequelize')
const models = require('.')

class User extends Model {}

User.init({
    userName: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        primaryKey: true
        
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
},{
    sequelize: database
})



module.exports = User