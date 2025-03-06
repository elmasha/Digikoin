const Dividend = require('../models/Dividend');

exports.createDividend = async (req, res) => {
    try {
        const dividend = await Dividend.create(req.body);
        res.status(201).json(dividend);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDividends = async (req, res) => {
    const dividends = await Dividend.findAll();
    res.json(dividends);
};

exports.getDividendById = async (req, res) => {
    const dividend = await Dividend.findByPk(req.params.id);
    dividend ? res.json(dividend) : res.status(404).json({ error: 'Dividend not found' });
};

exports.updateDividend = async (req, res) => {
    const dividend = await Dividend.findByPk(req.params.id);
    if (dividend) {
        await dividend.update(req.body);
        res.json(dividend);
    } else {
        res.status(404).json({ error: 'Dividend not found' });
    }
};

exports.deleteDividend = async (req, res) => {
    const dividend = await Dividend.findByPk(req.params.id);
    if (dividend) {
        await dividend.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Dividend not found' });
    }
};
