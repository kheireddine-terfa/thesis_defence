const mongoose = require('mongoose')
const fieldSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'field must have a title'],
  },
})
const Field = mongoose.model('Field', fieldSchema)
module.exports = Field
