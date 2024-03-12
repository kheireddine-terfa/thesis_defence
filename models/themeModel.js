const mongoose = require('mongoose')
const Professor = require('./professorModel')
const themeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'field must have a title'],
  },
  description: {
    type: String,
    required: [true, 'a theme should have a description'],
  },
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speciality',
  },
  premise: {
    // this will added by admin :
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Premise',
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
  },
})
//***** define pre find hook (populate) later if needed ...
themeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'speciality premise field',
  })
  next()
})
themeSchema.pre('remove', { document: true, query: false }, async function (
  next,
) {
  const themeId = this._id
  await Professor.updateMany(
    { themes: themeId },
    { $pull: { themes: themeId } },
  )
  next()
})
const Theme = mongoose.model('Theme', themeSchema)
module.exports = Theme
