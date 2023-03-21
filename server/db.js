const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME, // название базы данных
    process.env.DB_USER, // имя пользователя под которым подкл
    process.env.DB_PASSWORD, // пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)