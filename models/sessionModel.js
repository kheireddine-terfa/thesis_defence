const mongoose = require('mongoose')
const Binome = require('./binomeModel')

const sessionSchema = new mongoose.Schema({
  sessionType: {
    type: String,
    enum: ['normal', 'retake'],
    required: true,
  },
  // academicYear: {
  //   type: String,
  //   required: true,
  // }, deleted
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
  minCharge: {
    type: Number,
  },
})
//  virtual property for dateFormatted
sessionSchema.virtual('dateFormatted').get(function () {
  let formatted = {}
  const Sday = this.startSession.getDate()
  const Smonth = this.startSession.getMonth() + 1 // month is zero-based, so we add 1
  const Syear = this.startSession.getFullYear()
  const Eday = this.endSession.getDate()
  const Emonth = this.endSession.getMonth() + 1 // month is zero-based, so we add 1
  const Eyear = this.endSession.getFullYear()
  formatted = {
    start: `${Sday}-${Smonth}-${Syear}`,
    end: `${Eday}-${Emonth}-${Eyear}`,
  }
  return formatted
})

sessionSchema.pre('save', async function (next) {
  const {
    startDayHour,
    endDayHour,
    thesisDefenceDuration,
    break: breakDuration,
  } = this

  // Convert start and end day hours to ---> minutes
  const [startHour, startMinute] = startDayHour.split(':').map(Number)
  const [endHour, endMinute] = endDayHour.split(':').map(Number)
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute

  //  total session duration in minutes
  const totalSessionDuration = endMinutes - startMinutes

  //  available presentation time per day (subtract break duration)
  const availablePresentationTime = totalSessionDuration - breakDuration

  //  the number of thesis defense presentations per day
  const presentationsPerDay = Math.floor(
    availablePresentationTime / (thesisDefenceDuration + breakDuration),
  )

  this.nbr_thesis_per_day = presentationsPerDay || 0

  next()
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session
