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
