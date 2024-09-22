const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);

sequelize.sync()
    .then(() => console.log('Database connected and tables created/updated.'))
    .catch(err => console.error('Connection error:', err));

module.exports = sequelize;