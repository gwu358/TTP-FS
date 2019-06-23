const User = require('./user')
const Transaction = require('./transaction')
const User_stock = require('./user_stock')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
Transaction.belongsTo(User)
User.hasMany(Transaction)
User_stock.belongsTo(User)
User.hasMany(User_stock)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Transaction,
  User_stock
}
