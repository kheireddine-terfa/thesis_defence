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
    ref: 'Thesis',
    required: true,
  },
  //reference to binome:
  binome: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Binome',
    required: true,
  },
})
jurySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'professor1 professor2 thesis binome',
  })
  next()
})
const Jury = mongoose.model('Jury', jurySchema)
module.exports = Jury
