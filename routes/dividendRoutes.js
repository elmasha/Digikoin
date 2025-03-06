const express = require('express');
const router = express.Router();
const dividendController = require('../controllers/dividendController');

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
router.post('/', dividendController.createDividend);
router.get('/', dividendController.getDividends);
router.get('/:id', dividendController.getDividendById);
router.put('/:id', dividendController.updateDividend);
router.delete('/:id', dividendController.deleteDividend);

module.exports = router;
