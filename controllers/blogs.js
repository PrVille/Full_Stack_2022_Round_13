const router = require("express").Router()
const { Blog } = require("../models")

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll()
  //console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.post("/", async (req, res) => {
    const blog = await Blog.create(req.body)
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

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
  } else {
    res.status(404).end()
  }
})

module.exports = router
