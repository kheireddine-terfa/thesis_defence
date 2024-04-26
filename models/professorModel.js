const mongoose = require('mongoose')
const User = require('./userModel')
const bcrypt = require('bcrypt')
const professorSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'a professor must have a grade'],
    enum: ['MCA', 'MCB', 'PR', 'PHD', 'MAA', 'MAB'],
  },

  nbr_of_examined_theses: {
    type: Number,
    default: 0,
  },
  fields: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Field',
    },
  ],
  theses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Thesis',
    },
  ],
  supervisedBinomes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Binome',
    },
  ],
  nonAvailibility: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'NonAvailibility',
    },
  ],
})
professorSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'fields theses supervisedBinomes nonAvailibility',
  })
  next()
})

professorSchema.pre('save', async function (next) {
  //check if the password field modified or not (new or updated)
  if (!this.isModified('password')) return next()
  // encypt the password
  this.password = await bcrypt.hash(this.password, 12)
  // delete the passwordConfirm to be no presisted in the DB (because we need it only for validation)
  this.passwordConfirm = undefined
  next()
})
// instance methods:
professorSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}
const Professor = User.discriminator('Professor', professorSchema)

module.exports = Professor
