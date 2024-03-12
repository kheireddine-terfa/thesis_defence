const mongoose = require('mongoose')
const announceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'announce should have a title'],
  },
  content: {
    type: String,
    required: [true, 'announce should have a content'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})
const Announce = mongoose.model('Announce', announceSchema)
module.exports = Announce
