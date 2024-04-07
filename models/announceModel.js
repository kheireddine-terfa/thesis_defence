const mongoose = require('mongoose')
const cheerio = require('cheerio')
const announceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announce should have a title'],
  },
  content: {
    type: String,
    required: [true, 'Announce should have a content'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

//  virtual property for createdAtFormatted
announceSchema.virtual('createdAtFormatted').get(function () {
  const day = this.createdAt.getDate()
  const month = this.createdAt.getMonth() + 1 // month is zero-based, so we add 1
  const year = this.createdAt.getFullYear()
  const hour = this.createdAt.getHours()
  const minute = this.createdAt.getMinutes()

  return `${day}-${month}-${year} ${hour}:${minute}`
})
announceSchema.virtual('formattedContent').get(function () {
  // Load HTML content into cheerio : it used to extract data from web pages
  const $ = cheerio.load(this.content)
  const formattedText = $.text()
  return formattedText
})
const Announce = mongoose.model('Announce', announceSchema)

module.exports = Announce
