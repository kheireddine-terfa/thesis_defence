const mongoose = require('mongoose')
const moment = require('moment')

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    set: function (value) {
      // Utiliser Moment.js pour formater la date
      return moment(value).format()
    },
  },
  startHour: {
    type: String,
    required: true,
  },
  endHour: {
    type: String,
    required: true,
  },
  sessionType: {
    type: String,
    required: true,
  },
  nbr_thesis: {
    type: Number,
    default: 0,
  },
})

slotSchema.virtual('dateFormatted').get(function () {
  const dateFormat = moment(this.date).locale('fr').format('dddd DD/MM/YYYY')
  return `${dateFormat}`
})

const Slot = mongoose.model('Slot', slotSchema)
module.exports = Slot
