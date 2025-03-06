const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const EquityInvestment = sequelize.define('EquityInvestment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
    amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    project_name: { type: DataTypes.STRING }
}, { timestamps: true });

EquityInvestment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = EquityInvestment;
