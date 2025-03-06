const express = require('express');
const router = express.Router();
const equityInvestmentController = require('../controllers/equityInvestmentController');

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
router.post('/', equityInvestmentController.createEquityInvestment);
router.get('/', equityInvestmentController.getEquityInvestments);
router.get('/:id', equityInvestmentController.getEquityInvestmentById);
router.put('/:id', equityInvestmentController.updateEquityInvestment);
router.delete('/:id', equityInvestmentController.deleteEquityInvestment);

module.exports = router;
