const router = require("express").Router()
const middleware = require("../util/middleware")
const { Blog, User } = require("../models")

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
        model: User,
        attributes: ['name']
    }
  })
  //console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.post("/", middleware.tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    res.json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)  
  next()
}

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    //console.log(req.blog.toJSON())
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.blog.likes + 1
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete("/:id", blogFinder, middleware.tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)  
  if (req.blog) {
    if (user.id === req.blog.userId) {
        await req.blog.destroy()
        res.json(req.blog)
    } else {
        res.status(401).json({ error: "unauthorized" })
    }
  } else {
    res.status(404).end()
  }
})

module.exports = router
