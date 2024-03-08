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
})

const Jury = mongoose.model('Jury', jurySchema)
module.exports = Jury
