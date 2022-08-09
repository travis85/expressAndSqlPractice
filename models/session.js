const database = require('./database')
const { DataTypes, Model } = require('sequelize')

class User extends Model {}
Session.init({
    sid: {
        type: DataTypes.STRING(36)  ,
        allowNull: false,
        unique: true,
        primaryKey: true
        
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false
    }
    
    
},{
    sequelize: database
})

module.exports = Session