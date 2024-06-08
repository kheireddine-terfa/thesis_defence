const mongoose = require('mongoose')

const thesisDefenceSchema = new mongoose.Schema({
  thesis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thesis',
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
  },
  premise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Premise',
  },
})
// populate attributs :
thesisDefenceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'thesis premise slot',
  })
  next()
})
// Populate attributes:
thesisDefenceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'thesis',
    populate: [
      { path: 'professor', model: 'Professor' },
      {
        path: 'jury',
        populate: [
          { path: 'professor1', model: 'Professor' },
          { path: 'professor2', model: 'Professor' },
        ],
      },
    ],
  }).populate('slot premise')

  next()
})
const ThesisDefence = mongoose.model('ThesisDefence', thesisDefenceSchema)

module.exports = ThesisDefence
