const mongoose = require('mongoose')
const Professor = require('./professorModel')
const thesisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'field must have a title'],
  },
  description: {
    type: String,
    required: [true, 'a theme should have a description'],
  },
  affected: {
    type: Boolean,
    default: false,
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
  //reference to session :(link to normal session after affectation)
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
  },
  //reference to binome :
  binome: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Binome',
  },
  //reference to professor :
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
  },
  jury: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jury',
  },
})
// i need to populate the professor , jury , and binome
//***** define pre find hook (populate) later if needed ...
thesisSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'speciality premise field',
  })
  next()
})
thesisSchema.pre('remove', { document: true, query: false }, async function (
  next,
) {
  const thesisId = this._id
  await Professor.updateMany(
    { theses: thesisId },
    { $pull: { theses: thesisId } },
  )
  next()
})
const Thesis = mongoose.model('Thesis', thesisSchema)
module.exports = Thesis
