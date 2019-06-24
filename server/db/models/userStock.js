const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('user_stock', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})
