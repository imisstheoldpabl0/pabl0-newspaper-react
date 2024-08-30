// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


pool.connect(function(err) {
  if (err) throw err;
  console.log(`Connected to 'trade-boy' on PostgreSQL at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} on ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`);
})

module.exports = pool;
