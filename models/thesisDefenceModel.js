const mongoose = require('mongoose')

const thesisDefenceSchema = new mongoose.Schema({
  date: {
    // --- i can define it as a virtual property
    type: Date,
    required: true,
  },
  startHour: {
    type: Date,
    required: true,
  },
  endHour: {
    type: Date,
    required: true,
  },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
    required: [true, 'thesis defence must have a theme'],
  },
})

const ThesisDefence = mongoose.model('ThesisDefence', thesisDefenceSchema)

module.exports = ThesisDefence
