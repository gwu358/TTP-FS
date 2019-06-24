const router = require('express').Router()
const {Transaction} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.sendStatus(404)
    const transactions = await Transaction.findAll({
      order: [['updatedAt', 'DESC']],
      where: {
        userId: req.user.id
      }
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})
