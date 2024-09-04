import express from "express";
import cors from "cors";

import db from './connection.js';

import sessions from "express-session";
import cookieParser from "cookie-parser";

import path from 'path';

import {fileURLToPath} from 'url';

import basicAuth from 'express-basic-auth';

const __filename = fileURLToPath(import.meta.url);

export const app = express();


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
  //res.json("hello from backend ...");
  res.sendFile(path.join(__dirname, 'index.html'));



});

app.get("/getUserEmail", (req, res) => {

  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT email FROM users WHERE userId = ${req.query.userId}`;
  

  const userId= req.query.userId;

  db.query(q, [userId], (err, data) => {

    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});



app.get("/getUserNotificationLevel", (req, res) => {

  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT notificationLevel FROM users WHERE userId = ${req.query.userId}`;
  

  const userId= req.query.userId;

  db.query(q, [userId], (err, data) => {

    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});


app.get("/prefetchProducts", (req, res) => {

  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT products.productId as id, products.productName as title
  
  FROM products


  `;

  const userId= req.query.userId;

  db.query(q, [userId], (err, data) => {

    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});

//write app.get like the one above that take paramerter a comma separated list of product ids and return the producct ids 
//and the product name of the products with the given ids

app.get("/getProductsByIds", (req, res) => {

  console.log("req.query.ids", req.query.ids)
  

    const q = `SELECT products.productId, products.productName, products.productPic, products.categoryId, products.storeId, products.productSize , products.subCategoryId,
    sales.saleId, sales.saleStartDate,sales.saleEndDate,sales.storeId,sales.storeLogo, sales.oldPrice, sales.discountPrice,
    sales.discountPercentage
  
  
  FROM products
  
  left join sales on products.productId = sales.productId

  where products.productId in (${req.query.ids})

  order by sales.saleEndDate desc

  `;

  console.log('q',q);
  
    const userId= req.query.userId;

    
  
    db.query(q, [userId], (err, data) => {
  
      if (err) {
        console.log(err);
        return res.json(err);
      }
  
      return res.json(data);
    });
  }
  );

app.get("/products", (req, res) => {

  //console.log("valuessssss")
  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
  const q = `SELECT products.productId, products.productName, products.productPic, products.categoryId, 
  products.productSize , products.subCategoryId, products.storeId,
    sales.saleId, sales.saleStartDate,sales.saleEndDate,sales.storeLogo, sales.oldPrice, sales.discountPrice,
    sales.discountPercentage, store.storeLogo as storeLogo,

    CASE 
        WHEN f.id IS NOT NULL THEN true 
        ELSE false 
    END AS isFavorite
  
  
  FROM products
  
  left join sales on products.productId = sales.productId
  left join store on products.storeId = store.storeId
  left join favorites f on products.productId = f.productId

  order by isFavorite DESC,sales.saleEndDate desc

  `;

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

app.get("/getProductOnSale", (req, res) => {

  //console.log("valuessssss")
  const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let today = year +"-"+ month + "-" + day;
console.log()
//const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
const q = `SELECT products.productId, products.productName, products.productPic, products.categoryId, products.productSize , products.subCategoryId,
    sales.saleId, sales.productId,sales.saleStartDate,sales.saleEndDate,sales.storeId,sales.storeLogo, sales.oldPrice, sales.discountPrice,
    sales.discountPercentage

FROM products 
join sales on products.productId = sales.productId where 
CURRENT_DATE() between sales.saleStartDate and sales.saleEndDate`;

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

app.get("/getAllStores", (req, res) => {

  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
    const q = `SELECT * FROM store`;
  
    const userId=  parseInt(req.query.userId);
  
    db.query(q, [userId], (err, data) => {
  
      if (err) {
        console.log(err);
        return res.json(err);
      }
  
      return res.json(data);
    });
  });


  app.get("/getUserFavoriteStores", (req, res) => {

    //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
      const q = `SELECT userId, storeId FROM storeFavorites WHERE userId = ?`;
    
      const userId=  parseInt(req.query.userId);
    
      db.query(q, [userId], (err, data) => {
    
        if (err) {
          console.log(err);
          return res.json(err);
        }
    
        return res.json(data);
      });
    });


app.get("/getSubCategories", (req, res) => {

  //const q = "SELECT tableid,  users.id  FROM orders join users on orders.userid = users.id WHERE orders.status = 0 ";
    const q = `SELECT * FROM subcategories `;
  
    const userId=  parseInt(req.query.userId);
  
    db.query(q, [userId], (err, data) => {
  
      if (err) {
        console.log(err);
        return res.json(err);
      }
  
      return res.json(data);
    });
  });



app.get("/checkIfUserNameExists", (req, res) => {

  const username = req.query.userName;

  //console.log("x",req.query.id);

  const q = "SELECT count(*) as found FROM users WHERE userName = ? ";
  db.query(q, [username], (err, data) => {


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

app.post("/addUser", (req, res) => {
 
    const my = {errors:''}
    console.clear();
    console.log("valuessssss111111");
    const q = "INSERT INTO users(`userName`) VALUES (?)";
  
    const values = [
      req.body.userName
    ];
    console.log(">>" + req.body.userName);
   
    db.query(q, [values], (err, data) => {
  
      if (err) return res.send(err);
      return res.json(data);
    });
  });


  app.put("/updateUserEmail", (req, res) => {

    //convert string to number
    const userId = parseInt(req.body.userId);

    //convert to string with escape characters
    const userEmail = db.escape(req.body.userEmail);

  
    const q = `UPDATE users SET email=${userEmail} WHERE userId = ${userId}`;

    const values = [
      req.body.userId,
      req.body.userEmail
    ];

    //console.log(">>" + q);
    //console.log(">>" + req.body.userEmail);
  
    db.query(q, [values], (err, data) => {
      if (err) return res.send(err);
  
      //console.log("id",bookId)
      return res.json(data);
    });
  });


  app.put("/updateUserNotificationLevel", (req, res) => {
  
    const q = `UPDATE users SET notificationLevel= ${req.body.notificationId} WHERE userId = ${req.body.userId}`;

    const values = [
      req.body.userId,
      req.body.notificationId
    ];
  
    db.query(q, [values], (err, data) => {
      if (err) return res.send(err);
  
      //console.log("id",bookId)
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


app.post("/addStoreToFavorites", (req, res) => {
 
  const my = {errors:''}
  
     // console.log("valuessssss111111")
    const q = "INSERT INTO storefavorites( `userId`, `storeId`) VALUES (?)";
  
    const values = [
      req.body.userId,
      req.body.storeId
    ];
  
    const userId = req.body.userId
  
    console.log(">>" + req.body.userId);
    console.log(">>" + req.body.storeId);
    console.log(">>--" + req.method);
  
  
  
    db.query(q, [values], (err, data) => {
  
console.log("error",err)

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



app.delete("/removeStoreFromFavorites/:userId/:storeId", (req, res) => {


  //console.log("usersssss");

const q = " DELETE FROM storefavorites WHERE userId = ? and storeId = ? LIMIT 1";

const userId = req.params.userId;
const storeId = req.params.storeId;

console.log("user",req.params.userId)

db.query(q, [userId,storeId], (err, data) => {
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