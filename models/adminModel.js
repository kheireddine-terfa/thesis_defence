const mongoose = require('mongoose')
const User = require('./userModel')
const bcrypt = require('bcrypt')
const adminSchema = new mongoose.Schema({})
adminSchema.pre('save', async function (next) {
  //check if the password field modified or not (new or updated)
  if (!this.isModified('password')) return next()
  // encypt the password
  this.password = await bcrypt.hash(this.password, 12)
  // delete the passwordConfirm to be no presisted in the DB (because we need it only for validation)
  this.passwordConfirm = undefined
  next()
})
// instance methods:
adminSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}
const Admin = User.discriminator('Admin', adminSchema)

module.exports = Admin
