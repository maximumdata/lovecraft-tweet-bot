let mongoose = require.main.require('./app/config/db')

let schema = mongoose.Schema({
  user_id: String,
  content: String,
  tweet_id: String
})

module.exports = mongoose.model('tweet', schema)
