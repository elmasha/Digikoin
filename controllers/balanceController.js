const express = require("express");
const Balance = require('../models/Balance');
const router = express.Router();


exports.createBalance = async (req, res) => {
    try {
        const balance = await Balance.create(req.body);
        res.status(201).json(balance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBalances = async (req, res) => {
    const balances = await Balance.findAll();
    res.json(balances);
};

exports.getBalanceById = async (req, res) => {
    const balance = await Balance.findByPk(req.params.id);
    balance ? res.json(balance) : res.status(404).json({ error: 'Balance not found' });
};

exports.updateBalance = async (req, res) => {
    const balance = await Balance.findByPk(req.params.id);
    if (balance) {
        await balance.update(req.body);
        res.json(balance);
    } else {
        res.status(404).json({ error: 'Balance not found' });
    }
};

exports.deleteBalance = async (req, res) => {
    const balance = await Balance.findByPk(req.params.id);
    if (balance) {
        await balance.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Balance not found' });
    }
};
