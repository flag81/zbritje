//jshint esversion: 6
import mysql from 'mysql2';




const db = mysql.createPool({
  connectionLimit:4,
  host: "128.140.43.244",
  port: 5432,
  user: "mysql",
  password: "qbWdiCuFkMWED1TiFp9oY8mHliu2AeHV0uYkgSKXNxR2T7Hx5y8OH6X5jFjdKQi7",
  database:"default",
});

db.getConnection((err,connection)=> {
  if(err)
  throw err;
  //console.log('Database connected successfully');
  connection.release();
});

export default db;