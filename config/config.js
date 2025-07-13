require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'admin123',
    database: process.env.DATABASE_NAME || 'gemini_clone',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
  },
  // production: {
  //   use_env_variable: 'DATABASE_URL',
  //   dialect: 'postgres'
  // }
production: {
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
},
};
