const mongoose = require('mongoose')
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
  local: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Local',
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
  },
})
//***** define pre find hook (populate) later if needed ...

const Theme = mongoose.model('Theme', themeSchema)
module.exports = Theme
