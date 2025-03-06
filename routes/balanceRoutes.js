const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

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
router.post('/', balanceController.createBalance);
router.get('/', balanceController.getBalances);
router.get('/:id', balanceController.getBalanceById);
router.put('/:id', balanceController.updateBalance);
router.delete('/:id', balanceController.deleteBalance);

module.exports = router;
