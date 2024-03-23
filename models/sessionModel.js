const mongoose = require('mongoose')
const Binome = require('./binomeModel')
const { countNonWeekendDays } = require('../helpers/excludedDays')
const sessionSchema = new mongoose.Schema({
  sessionType: {
    type: String,
    enum: ['normal', 'retake'],
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  startSession: {
    type: Date,
    required: true,
  },
  endSession: {
    type: Date,
    required: true,
  },
  thesisDefenceDuration: {
    type: Number,
    required: true, // Duration in minutes
  },
  break: {
    type: Number,
    required: true, // Break duration in minutes
  },
  startDayHour: {
    type: String,
    required: true, // Start hour of the day for presentation (e.g., "09:00")
  },
  endDayHour: {
    type: String,
    required: true, // End hour of the day for presentation (e.g., "17:00")
  },
  nbr_thesis_per_day: {
    type: Number,
  },
})

sessionSchema.pre('save', async function (next) {
  // Calculate the number of days in the session
  const numDays = countNonWeekendDays(this.startSession, this.endSession)
  const nbrBinome = await Binome.countDocuments()
  this.nbr_thesis_per_day = nbrBinome / numDays
  next()
})
const Session = mongoose.model('Session', sessionSchema)

module.exports = Session
