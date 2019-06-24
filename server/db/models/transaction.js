const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('transaction', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})
