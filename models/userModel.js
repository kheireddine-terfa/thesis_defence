const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: [8, 'password must have more then 8 characters'],
    select: false,
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
})
const User = mongoose.model('User', userSchema)

module.exports = User
