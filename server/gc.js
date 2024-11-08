import express from "express";
import mysql from 'mysql2/promise';
export const app = express();


const db = mysql.createPool({
  connectionLimit:4,
  host: "localhost",
  user: "root",
  password: "prishtina81",
  database:"main",
});

app.get("/users", (req, res) => {

  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT * FROM users `;
  


  db.query(q, [], (err, data) => {

    if (err) {


      console.log("getUserEmail error:", err);
      return res.json(err);
    }

    return res.json(data);
  });
});


const dbConfig = {
    host: '127.0.0.1', // Connect to localhost if using Cloud SQL Auth Proxy
    user: 'flag81',
    password: 'Prishtina@81',
    database: 'zbritje',
    port: 3306
    
    // If not using Cloud SQL Auth Proxy, you'll need to connect using the 
    // instance's public IP address and potentially whitelist your IP.
  };

  app.get('/users', async (req, res) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT * FROM users'); // Example query
      await connection.end(); // Close the connection when done
  
      res.send('Hello world! Database results: ' + JSON.stringify(rows));
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/', async (req, res) => {
    try {
 // Close the connection when done
  
      res.send('Hello world from node! ');
    } catch (error) {
      console.error('Error connecting to node :', error);
      res.status(500).send('Internal Server Error');
    }
  });

  
  app.get('/products', async (req, res) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute('SELECT * FROM products'); // Example query
      await connection.end(); // Close the connection when done
  
      res.send('Hello world! Database results: ' + JSON.stringify(rows));
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Internal Server Error');
    }
  });


app.listen(8080, () => console.log('App is running at: http://localhost:8080'));