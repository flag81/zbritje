//jshint esversion: 6
import mysql from 'mysql2';


const db = mysql.createPool({
  connectionLimit:4,
  host: "localhost",
  user: "root",
  password: "prishtina81",
  database:"main",
});

db.getConnection((err,connection)=> {
  if(err)
  throw err;
  //console.log('Database connected successfully');
  connection.release();
});

export default db;