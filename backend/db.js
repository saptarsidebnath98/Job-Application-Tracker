const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mysql@pk98",
  database: "job_tracker",
});

module.exports = db;