const mongoose = require('mongoose')
const jurySchema = new mongoose.Schema({
  professor1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true,
  },
  professor2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true,
  },
  // add reference to thesis:
  thesis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'thesis',
  },
})

const Jury = mongoose.model('Jury', jurySchema)
module.exports = Jury
