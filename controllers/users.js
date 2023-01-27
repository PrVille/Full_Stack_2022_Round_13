const router = require("express").Router()
const middleware = require("../util/middleware")

const { User, Blog } = require("../models")

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  })
  res.json(users)
})

router.post("/", async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get("/:id", async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read === "true"
  }

  const user = await User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["read", "id"],
          where
        }
      }
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.put("/status/:username", middleware.tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })
  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})



module.exports = router
