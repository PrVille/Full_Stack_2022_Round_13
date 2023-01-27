const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session } = require('../models')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).send({ error: error.errors[0].message })
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(400).send({ error: error.message })
  }

  console.log('-----ERROR HANDLER-----\n', error, '\n-----END-----')

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }

    console.log(authorization.substring(7))

    const session = await Session.findOne({
      where: {
        token: authorization.substring(7),
      },
    })

    console.log(session)

    if (!session) {
      return res.status(401).json({ error: 'invalid session' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
}
