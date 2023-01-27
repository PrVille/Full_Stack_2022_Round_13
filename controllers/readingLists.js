const router = require('express').Router()
const middleware = require('../util/middleware')
const { ReadingList, User } = require('../models')

router.post('/', async (req, res) => {
  const readingList = await ReadingList.create(req.body)
  res.json(readingList)
})

router.put('/:id', middleware.tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const readingList = await ReadingList.findOne({
    where: {
      id: req.params.id,
    },
  })
  if (readingList) {
    if (user.id === readingList.userId) {
      readingList.read = req.body.read
      await readingList.save()
    } else {
      res.status(401).json({ error: 'unauthorized' })
    }

    res.json(readingList)
  } else {
    res.status(404).end()
  }
})

module.exports = router
