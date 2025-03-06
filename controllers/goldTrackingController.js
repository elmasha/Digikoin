const GoldTracking = require('../models/GoldTracking'); // Declare only once

exports.createGoldTracking = async (req, res) => {
    try {
        const goldTracking = await GoldTracking.create(req.body);
        res.status(201).json(goldTracking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGoldTrackings = async (req, res) => {
    const goldTrackings = await GoldTracking.findAll();
    res.json(goldTrackings);
};

exports.getGoldTrackingById = async (req, res) => {
    const goldTracking = await GoldTracking.findByPk(req.params.id);
    goldTracking ? res.json(goldTracking) : res.status(404).json({ error: 'Gold tracking record not found' });
};

exports.updateGoldTracking = async (req, res) => {
    const goldTracking = await GoldTracking.findByPk(req.params.id);
    if (goldTracking) {
        await goldTracking.update(req.body);
        res.json(goldTracking);
    } else {
        res.status(404).json({ error: 'Gold tracking record not found' });
    }
};

exports.deleteGoldTracking = async (req, res) => {
    const goldTracking = await GoldTracking.findByPk(req.params.id);
    if (goldTracking) {
        await goldTracking.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Gold tracking record not found' });
    }
};
