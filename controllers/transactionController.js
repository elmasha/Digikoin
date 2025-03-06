const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.findAll();
    res.json(transactions);
};

exports.getTransactionById = async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);
    transaction ? res.json(transaction) : res.status(404).json({ error: 'Transaction not found' });
};

exports.updateTransaction = async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
        await transaction.update(req.body);
        res.json(transaction);
    } else {
        res.status(404).json({ error: 'Transaction not found' });
    }
};

exports.deleteTransaction = async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
        await transaction.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Transaction not found' });
    }
};
