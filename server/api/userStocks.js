const router = require('express').Router()
const {UserStock} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(404)
    const userStock = await UserStock.findAll({
      order: [['symbol']],
      where: {
        userId: req.user.id
      }
    })
    res.json(userStock)
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(404)
    const {symbol, quantity} = req.body
    let stock = await UserStock.findOne({
      where: {userId: req.user.id, symbol}
    })
    if (!stock) {
      await UserStock.create({userId: req.user.id, symbol, quantity})
    } else {
      await UserStock.update(
        {quantity: stock.quantity + quantity},
        {
          where: {userId: req.user.id, symbol}
        }
      )
    }
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
