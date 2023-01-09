const mariadb = require('mariadb'),
  dotenv = require('dotenv').config();


// Expose the Pool object within this module
module.exports = Object.freeze({
  pool: mariadb.createPool({
    host: 'db',
    port: 3306,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD
  })
});