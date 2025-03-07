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


///....Create a Users table......
router.get('/createUser', (req, res)=>{
    let sql =
     `CREATE TABLE Users (id  int AUTO_INCREMENT ,uid VARCHAR(255),profileImage VARCHAR(255),username VARCHAR(255), wallet_address VARCHAR(255),wallet_balance DECIMAL(18,8), email VARCHAR(255), timestamp DATE, PRIMARY KEY (id))`;
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
   router.put('/registerUser', (req, res) => {

    const {
        uid,
        profileImage,
        username,
        wallet_address,
        wallet_balance,
        email,
        timestamp,
       
    } = req.body;

       let Users =
        {
            uid,
            profileImage,
            username,
            wallet_address,
            wallet_balance,
            email,
            timestamp,
         };

         console.log(req.body);
        
       let sql = 'iNSERT INTO Users SET?';
       let query = pool.query(sql, Users,(err, result)=>{
        if(err !=null){
            res.status(404).json(err);
        } else{
            console.log(result);
            res.status(200).json("User was added successfully")
           console.log("User was added successfully");
        } 
       
       });
   })
   
   ///....Fetch Users .........
   router.get('/', (req, res) => {
       let sql = 'SELECT * FROM Users';
       let query = pool.query(sql, (err, result)=>{
        if(err !=null){
           return res.status(404).json(err);
        }
       console.log(result);
       res.status(200).json(result);
       console.log("User fetched");
       });
   })
   
   ///....Select User .........
   router.get('/getUser/:uid/', (req, res) => {
    let uid = req.params.uid;
       let sql = `SELECT * FROM Users WHERE uid = ?`;
       let query = pool.query(sql, [uid], (err, result)=>{
           if(err != null){
            res.status(404).send(err)
           }else {
            console.log(result);
            res.status(200).json(result);
            console.log("User query fetched");
           } 
       
       });
   })


   ////......Search Users...../////
   router.get('/searchUsers', (req, res) => {
    const { query } = req.query; // Retrieve the search query from the client

    if (!query) {
        return res.status(400).send("Search query is required");
    }

    // Full-Text Search Query
    let sql = `
        SELECT id, title, body, description, image, timestamp
        FROM Users
        WHERE MATCH(title, body, description) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;

    pool.query(sql, query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error searching Users");
        }
        res.status(200).json(results);
    });
});
      
   ///....Update User .........
   router.post('/updateUser/:id/', (req, res) => {
    let User =
    {
    title: req.body.title, 
    body: req.body.body,
    description: req.body.description,
    image: req.body.image, 
    timestamp: new Date
     };
       let sql = `UPDATE  Users SET title = '${User.title}', body = '${User.body}' WHERE id = ${req.params.id}`;
       let query = pool.query(sql, User, (err, result)=>{
           if(err)  res.status(404).send(err);
       console.log(result);
       res.status(201).send("Updated");
       console.log(`User ${User.title} updated`);
       });
   })


   
   ///....CheckExisting User .........
   router.get('/existingUser/:wallet_address/', (req, res) => {
    const phone = req.params.wallet_address;
    const userCategory = req.body.uid;
    const query = "SELECT 1 FROM users WHERE wallet_address = ? AND uid = ?";
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


  
   
   ///....Delete User .........
   router.post('/deleteUser/:id/', (req, res) => {
       let sql = `DELETE FROM Users WHERE id = ${req.body.uid}`;
       let query = pool.query(sql, (err, result)=>{
           if(err)  res.status(404).send(err);
       console.log(result);
       res.status(200).send("User Deleted...");
       console.log(`User Deleted...`);
       });
   })


// Find closest supplier for a retailer
router.get("/closestSupplier/:retailerUID", (req, res) => {
    const { retailerUID } = req.params;

    // Fetch retailer's location first
    const getRetailerLocation = `SELECT lat, lng FROM users WHERE uid = ? AND userCategory = 'retailer'`;

    pool.query(getRetailerLocation, [retailerUID], (err, retailerResults) => {
        if (err) {
            console.error("Error fetching retailer location:", err);
            return res.status(500).json({ error: "Error fetching retailer location." });
        }

        if (retailerResults.length === 0) {
            return res.status(404).json({ error: "Retailer not found." });
        }

        const { lat, lng } = retailerResults[0];

        // Find the nearest supplier
        const findSupplierQuery = `
            SELECT 
            id AS id,
                uid AS supplierID,
                username AS username,
                shopName AS shopName,
                lat,
                lng,
                (6371 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(lat)) * 
                    COS(RADIANS(lng) - RADIANS(?)) + 
                    SIN(RADIANS(?)) * SIN(RADIANS(lat))
                )) AS distance_km,
                (6371000 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(lat)) * 
                    COS(RADIANS(lng) - RADIANS(?)) + 
                    SIN(RADIANS(?)) * SIN(RADIANS(lat))
                )) AS distance_meters
            FROM users
            WHERE userCategory = 'supplier'
            ORDER BY distance_km ASC
           ;
        `;

        pool.query(findSupplierQuery, [lat, lng, lat, lat, lng, lat], (err, results) => {
            if (err) {
                console.error("Error finding closest supplier:", err);
                return res.status(500).json({ error: "Error finding closest supplier." });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "No suppliers found." });
            }

            res.status(200).json(results); // Return the nearest supplier
        });
    });
});





module.exports = router;
