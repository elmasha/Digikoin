const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const router = express.Router();
const pool = require('../db/config');

const _urlencoded = express.urlencoded({ extended: false });
router.use(cors());
router.use(bodyParser.json());
router.use(express.static("public"));


//----AllOW ACCESS -----//
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST , PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


///....Create a transactions table......
router.get('/createTransaction', (req, res)=>{
    let sql =
     `CREATE TABLE transactions
(id SERIAL PRIMARY KEY, uid INTEGER REFERENCES users(id)
ON DELETE CASCADE, type VARCHAR(50),
amount DECIMAL(18,8) NOT NULL, gold_equivalent DECIMAL(18,8), transaction_hash VARCHAR(255) UNIQUE,
 status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
    pool.query(sql,(err,result)=>{
       if(err != null){
        res.status(404).send(err);
       }else{
console.log(result);
       res.send("Table was created successfully")
       console.log("Table was created successfully");
       }  
       
    })
   });
   
   ///....Insert Data into the table
   router.put('/registerTransaction', (req, res) => {

    const {
        uid,
        profileImage,
        Transactionname,
        wallet_address,
        email,
        timestamp,
       
    } = req.body;

       let transactions =
        {
            uid,
            profileImage,
            Transactionname,
            wallet_address,
            email,
            timestamp,
         };

         console.log(req.body);
        
       let sql = 'iNSERT INTO transactions SET?';
       let query = pool.query(sql, transactions,(err, result)=>{
        if(err !=null){
            res.status(404).json(err);
        } else{
            console.log(result);
            res.status(200).json("Transaction was added successfully")
           console.log("Transaction was added successfully");
        } 
       
       });
   })
   
   ///....Fetch transactions .........
   router.get('/', (req, res) => {
       let sql = 'SELECT * FROM transactions';
       let query = pool.query(sql, (err, result)=>{
        if(err !=null){
           return res.status(404).json(err);
        }
       console.log(result);
       res.status(200).json(result);
       console.log("Transaction fetched");
       });
   })
   
   ///....Select Transaction .........
   router.get('/getTransaction/:uid/', (req, res) => {
    let uid = req.params.uid;
       let sql = `SELECT * FROM transactions WHERE uid = ?`;
       let query = pool.query(sql, [uid], (err, result)=>{
           if(err != null){
            res.status(404).send(err)
           }else {
            console.log(result);
            res.status(200).json(result);
            console.log("Transaction query fetched");
           } 
       
       });
   })


   ////......Search transactions...../////
   router.get('/searchTransactions', (req, res) => {
    const { query } = req.query; // Retrieve the search query from the client

    if (!query) {
        return res.status(400).send("Search query is required");
    }

    // Full-Text Search Query
    let sql = `
        SELECT id, title, body, description, image, timestamp
        FROM transactions
        WHERE MATCH(title, body, description) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;

    pool.query(sql, query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error searching transactions");
        }
        res.status(200).json(results);
    });
});
      
   ///....Update Transaction .........
   router.post('/updateTransaction/:id/', (req, res) => {
    let Transaction =
    {
    title: req.body.title, 
    body: req.body.body,
    description: req.body.description,
    image: req.body.image, 
    timestamp: new Date
     };
       let sql = `UPDATE  transactions SET title = '${Transaction.title}', body = '${Transaction.body}' WHERE id = ${req.params.id}`;
       let query = pool.query(sql, Transaction, (err, result)=>{
           if(err)  res.status(404).send(err);
       console.log(result);
       res.status(201).send("Updated");
       console.log(`Transaction ${Transaction.title} updated`);
       });
   })


   
   ///....CheckExisting Transaction .........
   router.get('/existingTransaction/:wallet_address/', (req, res) => {
    const phone = req.params.wallet_address;
    const TransactionCategory = req.body.uid;
    const query = "SELECT 1 FROM transactions WHERE wallet_address = ? AND uid = ?";
    pool.query(query, [wallet_address,uid], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Internal Server Error");
      }
  
      if (results.length > 0) {
        res.send({ exists: true, message: `UID ${phone} exists.` });
      } else {
        res.send({ exists: false, message: `UID ${phone} does not exist.` });
      }
    });
     
   })


  
   
   ///....Delete Transaction .........
   router.post('/deleteTransaction/:id/', (req, res) => {
       let sql = `DELETE FROM transactions WHERE id = ${req.body.uid}`;
       let query = pool.query(sql, (err, result)=>{
           if(err)  res.status(404).send(err);
       console.log(result);
       res.status(200).send("Transaction Deleted...");
       console.log(`Transaction Deleted...`);
       });
   })


// Find closest supplier for a retailer



module.exports = router;
