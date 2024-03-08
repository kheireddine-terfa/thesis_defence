const mongoose = require('mongoose')
const pairSchema = new mongoose.Schema({
  student1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'a pair (binom) should have one student at least'],
  },
  student2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
    required: [true, 'pair (binome) must have a theme'],
  },
})
pairSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'theme',
  })
  next()
})
const Pair = mongoose.model('Pair', pairSchema)
module.exports = Pair
