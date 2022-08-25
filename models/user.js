const database = require('./database')
const { DataTypes, Model } = require('sequelize')

class User extends Model {}
//SEQULIZE TEMPLATE
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
    cover_photo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    profile_photo: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: https://pixabay.com/images/id-973460/
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    website: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    session_id: {
        type: DataTypes.TEXT,
        unique: true,
        primaryKey: true
    }
    
},{
    sequelize: database
})




module.exports = User