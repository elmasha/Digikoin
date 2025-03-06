const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Dividend = sequelize.define('Dividend', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    status: { type: DataTypes.ENUM('unclaimed', 'claimed'), defaultValue: 'unclaimed' }
}, { timestamps: true });

Dividend.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Dividend;
