const express = require('express');
const router = express.Router();
const goldTrackingController = require('../controllers/goldTrackingController');

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
router.post('/', goldTrackingController.createGoldTracking);
router.get('/', goldTrackingController.getGoldTrackings);
router.get('/:id', goldTrackingController.getGoldTrackingById);
router.put('/:id', goldTrackingController.updateGoldTracking);
router.delete('/:id', goldTrackingController.deleteGoldTracking);

module.exports = router;
