const mysql = require('mysql');
const dbConfig= require('../config/db')

const con = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.databaseName
});

const con1 = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });

con.connect(function(err){
    if(err){
        console.log("connection fail");
        con1.query("CREATE DATABASE IF NOT EXISTS "+dbConfig.databaseName+"", function (err, result) {
            if (err) {
                console.log("db create fail");
            }else{
                console.log("Database created");
                con.connect();  
                console.log("connected");    
            }
        });
    }
    else{
        console.log("connected");
    }
})
module.exports=con;