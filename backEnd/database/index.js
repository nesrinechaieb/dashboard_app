/*var mysql = require('mysql2')
var conn = mysql.createConnection({
  host : 'localhost',
    user : 'root',
    password : '',
    database : 'school',
})
conn.connect((err)=>{
    if(err){
        console.log(err);
    }
    else {
        console.log('db connected');
    }
})
module.exports = conn*/

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school",
});
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE username = ? AND password = ?";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json("error");
    if (data.length > 0) {
      return res.json("login Successfully");
    } else {
      return res.json("no record");
    }
  });
});

app.listen(3000, () => {
  console.log("db connected");
});
