const mongoose = require('mongoose')
const localSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'local must have a name'],
  },
})
const Local = mongoose.model('Local', localSchema)
