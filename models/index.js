const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasOne(Session)
Session.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList })
User.belongsToMany(Blog, { as: 'readings', through: ReadingList })

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
}
