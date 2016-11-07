let mongoose = require.main.require('./app/config/db')

let schema = mongoose.Schema({
  title: String,
  content: String
})

module.exports = mongoose.model('stories', schema)
