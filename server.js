require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = 4000;


// Import database & models

// Import Routes
const userRoutes = require('./routes/userRoutes');
const stripePayment = require('./stripe');

// const transactionRoutes = require('./routes/transactionRoutes');
// const balanceRoutes = require('./routes/balanceRoutes');
// const equityInvestmentRoutes = require('./routes/equityInvestmentRoutes');
// const dividendRoutes = require('./routes/dividendRoutes');
// const goldTrackingRoutes = require('./routes/goldTrackingRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/payments', stripePayment);
app.use('/user', userRoutes);
// app.use('/transactions', transactionRoutes);
// app.use('/balances', balanceRoutes);
// app.use('/equityInvestments', equityInvestmentRoutes);
// app.use('/dividends', dividendRoutes);
// app.use('/goldTracking', goldTrackingRoutes);

app.get('/', (req, res)=>{
    res.status(200).send("Welcome to nodejs meatPro server");
   });


app.listen(port,(error)=>{
    if (error) {
        console.error("Error starting the server:", error);
    } else {
        console.log(`Server running on port http://localhost:${port}`);
    }
});
