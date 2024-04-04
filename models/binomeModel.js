const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const binomeSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'opps! you forgot the username...'],
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'please provide a valid email'],
    required: [true, 'opps! you forgot the password'],
  },
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: [8, 'password must have more then 8 characters'],
    select: false,
  },
  student1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'a binome (binom) should have one student at least'],
    unique: [true, 'a student must belong to only one binome'],
  },
  student2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    unique: [true, 'a student must belong to only one binome'],
    sparse: true,
  },
  ApprovedThesis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thesis',
    unique: [true, 'a Thesis must belong to only one binome'],
    sparse: true,
  },
  selectedThesis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thesis',
    },
  ],
})
binomeSchema.pre('save', async function (next) {
  //check if the password field modified or not (new or updated)
  if (!this.isModified('password')) return next()
  // encypt the password
  this.password = await bcrypt.hash(this.password, 12)
  // delete the passwordConfirm to be no presisted in the DB (because we need it only for validation)
  next()
})
// instance methods:
binomeSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

binomeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'ApprovedThesis selectedThesis student1 student2',
  })
  next()
})
const Binome = mongoose.model('Binome', binomeSchema)
module.exports = Binome
