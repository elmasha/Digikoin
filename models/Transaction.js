const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    type: { type: DataTypes.ENUM('buy', 'redeem', 'equity_investment'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    gold_equivalent: { type: DataTypes.DECIMAL(18, 8) },
    transaction_hash: { type: DataTypes.STRING, unique: true },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' }
}, { timestamps: true });

Transaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Transaction;
