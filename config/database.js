require('dotenv').config();
const express = require('express')
const router = express.Router();
const mysql  = require('mysql')

let db;
if(process.env.JAWSDB_URL != null){
  db =  mysql.createConnection(process.env.JAWSDB_URL);
}else{
     db = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database : 'test_digikoin',
    })
}
//Create a Connection to Database



db.connect((err)=>{
    if(err!=null){
        console.log('No Connect to database')
        
    }else{
        console.log('Connect to database')
    }
    
})

module.exports = db;