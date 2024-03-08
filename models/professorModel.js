const mongoose = require('mongoose')
const User = require('./userModel')
const bcrypt = require('bcrypt')

const professorSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'a professor must have a grade'],
  },
})
professorSchema.pre('save', async function (next) {
  //check if the password field modified or not (new or updated)
  if (!this.isModified('password')) return next()
  // encypt the password
  this.password = await bcrypt.hash(this.password, 12)
  // delete the passwordConfirm to be no presisted in the DB (because we need it only for validation)
  next()
})
// instance methods:
professorSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}
const Professor = User.discriminator('Professor', professorSchema)

module.exports = Professor
