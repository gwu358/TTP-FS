const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.put('/', async (req, res, next) => {
  try {
    await User.update(
      {balance: req.user.balance},
      {
        where: {id: req.user.id}
      }
    )
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
