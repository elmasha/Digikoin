const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Balance = sequelize.define('Balance', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, references: { model: User, key: 'id' } },
    token_balance: { type: DataTypes.DECIMAL(18, 8), defaultValue: 0 },
    gold_reserved: { type: DataTypes.DECIMAL(18, 8), defaultValue: 0 }
}, { timestamps: false });

Balance.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Balance;

