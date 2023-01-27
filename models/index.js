const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList })
User.belongsToMany(Blog, {  as: 'readings', through: ReadingList })

module.exports = {
    Blog, 
    User,
    ReadingList
}