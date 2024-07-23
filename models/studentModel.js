const mongoose = require('mongoose')
const User = require('./userModel')
const bcrypt = require('bcrypt')

const studentSchema = new mongoose.Schema({
  matricule: {
    type: String,
    required: [true, 'a student must have a registration number'],
    minlength: [12, 'the registration number should have 12 numbers'],
    maxlength: [12, 'the registration number should have 12 numbers'],
    unique: [true, 'the registration number should be unique for each student'],
  },
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speciality',
  },
  partOfBinome: {
    type: Boolean,
    default: false,
  },
})
studentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'speciality',
  })
  next()
})
//***** define pre find hook (populate) later if needed ...
studentSchema.pre('save', async function (next) {
  //check if the password field modified or not (new or updated)
  if (!this.isModified('password')) return next()
  // encypt the password
  this.password = await bcrypt.hash(this.password, 12)
  // delete the passwordConfirm to be no presisted in the DB (because we need it only for validation)
  this.passwordConfirm = undefined
  next()
})
// instance methods:
studentSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}
const Student = User.discriminator('Student', studentSchema)

module.exports = Student
