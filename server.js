require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;


// Import database & models
const sequelize = require('./config/database');

const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Balance = require('./models/Balance');
const EquityInvestment = require('./models/EquityInvestment');
const Dividend = require('./models/Dividend');
const GoldTracking = require('./models/GoldTracking');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const equityInvestmentRoutes = require('./routes/equityInvestmentRoutes');
const dividendRoutes = require('./routes/dividendRoutes');
const goldTrackingRoutes = require('./routes/goldTrackingRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/user', userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/balances', balanceRoutes);
app.use('/equityInvestments', equityInvestmentRoutes);
app.use('/dividends', dividendRoutes);
app.use('/goldTracking', goldTrackingRoutes);

// Sync Database
sequelize.sync({ alter: false })
    .then(() => console.log('Database tables synchronized'))
    .catch(err => console.error('Error syncing tables:', err));

 app.get('/', (req, res) => {
    console.log('Welcome to voltedge servers');
    res.status(200).json({message: 'Welcome to voltedge servers'});
 });   

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
