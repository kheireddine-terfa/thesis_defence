const moment = require('moment')
exports.countNonWeekendDays = (startSession, endSession) => {
  let currentDate = moment(startSession) // Use moment.js for date manipulation
  const endSessionDate = moment(endSession)
  let numDays = 0

  while (currentDate <= endSessionDate) {
    if (currentDate.day() !== 5 && currentDate.day() !== 6) {
      // Check if not Friday (5) or Saturday (6)
      numDays++
    }
    currentDate.add(1, 'days') // Move to the next day
  }
  return numDays
}
