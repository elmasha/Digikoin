const EquityInvestment = require('../models/EquityInvestment');

exports.createEquityInvestment = async (req, res) => {
    try {
        const equityInvestment = await EquityInvestment.create(req.body);
        res.status(201).json(equityInvestment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEquityInvestments = async (req, res) => {
    const equityInvestments = await EquityInvestment.findAll();
    res.json(equityInvestments);
};

exports.getEquityInvestmentById = async (req, res) => {
    const equityInvestment = await EquityInvestment.findByPk(req.params.id);
    equityInvestment ? res.json(equityInvestment) : res.status(404).json({ error: 'Equity investment not found' });
};

exports.updateEquityInvestment = async (req, res) => {
    const equityInvestment = await EquityInvestment.findByPk(req.params.id);
    if (equityInvestment) {
        await equityInvestment.update(req.body);
        res.json(equityInvestment);
    } else {
        res.status(404).json({ error: 'Equity investment not found' });
    }
};

exports.deleteEquityInvestment = async (req, res) => {
    const equityInvestment = await EquityInvestment.findByPk(req.params.id);
    if (equityInvestment) {
        await equityInvestment.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Equity investment not found' });
    }
};
