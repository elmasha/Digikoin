const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoldTracking = sequelize.define('GoldTracking', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    location: { type: DataTypes.STRING },
    current_gold_stock: { type: DataTypes.DECIMAL(18, 8) },
    daily_production: { type: DataTypes.DECIMAL(18, 8) }
}, { timestamps: true });

module.exports = GoldTracking;
