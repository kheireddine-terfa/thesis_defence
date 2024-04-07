const mongoose = require('mongoose')
const specialitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'speciality must have a title'],
  },
  abbreviation: {
    type: String,
    required: [true, 'speciality must have an abbreviation'],
  },
})
const Speciality = mongoose.model('Speciality', specialitySchema)
module.exports = Speciality
