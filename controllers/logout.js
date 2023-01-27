const router = require('express').Router()
const Session = require('../models/session')
const middleware = require('../util/middleware')

router.delete('/', middleware.tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.decodedToken.id,
    },
  })
  res.json({ message: 'success' })
})

module.exports = router
