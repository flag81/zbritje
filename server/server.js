import express from "express";
import cors from "cors";

import db from './connection.js';

import sessions from "express-session";
import cookieParser from "cookie-parser";

import path from 'path';

import {fileURLToPath} from 'url';

import basicAuth from 'express-basic-auth';

const __filename = fileURLToPath(import.meta.url);

const app = express();


//const ts = require('./order')

//import { db, app } from "./db";
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(cookieParser());

var session ;

const auth = basicAuth({
  users: {
    admin: '123',
    user: '456',
  },
});


app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));


app.get('/authenticate', auth, (req, res) => {
  const options = {
    httpOnly: true,
    signed: false,
    maxAge: 1000*60*60*24*7
  };

  console.log(req.auth.user);

  if (req.auth.user === 'admin') {
    res.cookie('name', 'admin', options).send({ screen: 'admin' });
  } else if (req.auth.user === 'user') {
    res.cookie('name', 'user', options).send({ screen: 'user' });
  }
});

app.get('/read-cookie', (req, res) => {
  console.log(req.signedCookies);
  if (req.signedCookies.name === 'admin') {
    res.send({ screen: 'admin' });
  } else if (req.signedCookies.name === 'user') {
    res.send({ screen: 'user' });
  } else {
    res.send({ screen: 'auth' });
  }
});

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('name').end();
});

app.get('/get-data', (req, res) => {
  if (req.signedCookies.name === 'admin') {
    res.send('This is admin panel');
  } else if (req.signedCookies.name === 'user') {
    res.send('This is user data');
  } else {
    res.end();
  }
});



app.get("/", (req, res) => {
  res.json("hello from backend ...");
});


app.get("/products", (req, res) => {

  //console.log("valuessssss")
  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = "SELECT * FROM products where productId ";

  const userId= req.query.userId;

  db.query(q, [userId], (err, data) => {

    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});


app.get("/getFavorites", (req, res) => {

//console.log("valuessssss")
const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let today = year +"-"+ month + "-" + day;
console.log()
  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT * FROM products join favorites on products.productId = favorites.productId where favorites.userId=? `;

  const userId=  parseInt(req.query.userId);

 // console.log("userid",userId);
  db.query(q, [userId], (err, data) => {

    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});

app.get("/getSaleFavorites", (req, res) => {

  //console.log("valuessssss")
  const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let today = year +"-"+ month + "-" + day;
console.log()
//const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
const q = `SELECT * FROM products join favorites on products.productId = favorites.productId where favorites.userId=? and CURRENT_DATE() between products.saleStartDate and products.saleEndDate`;

const userId=  parseInt(req.query.userId);

// console.log("userid",userId);
db.query(q, [userId], (err, data) => {

  if (err) {
    console.log(err);
    return res.json(err);
  }

  return res.json(data);
});
});


app.get("/getCategories", (req, res) => {

//const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT * FROM categories `;

  const userId=  parseInt(req.query.userId);

  db.query(q, [userId], (err, data) => {

    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});



app.get("/authUser", (req, res) => {

  const username = req.query.username;
  const password = req.query.password;

  //console.log("x",req.query.id);

  const q = "SELECT count(*) FROM users WHERE username = ? AND password = ?";
  db.query(q, [username, password], (err, data) => {


    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});


app.get("/getOrder", (req, res) => {

  const tableId = req.query.id;

  //console.log("x",req.query.id);

  const q = "SELECT * FROM orders WHERE tableid = ? AND status = 0";
  db.query(q, [tableId], (err, data) => {


    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});


app.put("/closeOrder", (req, res) => {
  const tableId = req.body.id;
  const q = "UPDATE orders SET `status`= 1 WHERE tableid = ?";

  db.query(q, [tableId], (err, data) => {
    if (err) return res.send(err);

    //console.log("id",bookId)
    return res.json(data);
  });
});


app.put("/updateOrder", (req, res) => {

  const tableId = req.body.id;
  const orderdata = req.body.orderdata;

  const myJSON = JSON.stringify(orderdata);


    const values = [

    req.body.orderdata,
    req.body.id,
   

  ];

   //orderdata = JSON.parse(orderdata)


  console.log(orderdata)
  const q = "UPDATE orders SET `orderdata`= ? WHERE tableid = ?";

  db.query(q, [myJSON, tableId], (err, data) => {
    if (err) return res.send(err);

    return res.json(data);
  });
});




app.get("/AllTables", (req, res) => {
  const q = "SELECT * FROM tables";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});


app.post("/add", (req, res) => {
  const q = "INSERT INTO tables(`nr`, `id`, `xcord`, `ycord`) VALUES (?)";

  const values = [
    req.body.nr,
    req.body.id,
    req.body.xcord,
    req.body.ycord,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});



app.post("/addFavorite", (req, res) => {
 
const my = {errors:''}

    //console.log("valuessssss111111")
  const q = "INSERT INTO favorites( `userId`, `productId`) VALUES (?)";

  const values = [
    req.body.userId,
    req.body.productId
  ];

  const userId = req.body.userId

  console.log(">>" + req.body.userId);
  console.log(">>" + req.body.productId);
  console.log(">>--" + req.method);



  db.query(q, [values], (err, data) => {

    if (err) return res.send(err);
    return res.json(data);
  });
});


app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});





app.delete("/removeFavorite/:userId/:productId", (req, res) => {


    //console.log("usersssss");

  const q = " DELETE FROM favorites WHERE userId = ? and productId = ? LIMIT 1";

  const userId = req.params.userId;
  const productId = req.params.productId;

console.log("user",req.params.userId)

  db.query(q, [userId,productId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});


app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/update/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE tables SET `xcord`= ?, `ycord`= ? WHERE id = ?";

  const values = [
    req.body.xcord,
    req.body.ycord,

  ];

  db.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);

    console.log("id",bookId)
    return res.json(data);
  });
});

app.listen(8800, () => {
  //console.log("Connected to backend.");
});