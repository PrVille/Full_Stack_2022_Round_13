const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, request, response, next) => {    
  console.error(error.name)

  if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: error.message })
  } else if (error.name === "SequelizeDatabaseError") {
    return response.status(400).send({ error: error.message })
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).send({ error: error.errors[0].message })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler, 
  tokenExtractor
}
