const mongoose = require('mongoose')
const nonAvailibilitySchema = new mongoose.Schema(
  {
    startDay: {
      type: Date,
    },
    endDay: {
      type: Date,
    },
  },

  {
    strictQuery: true, // it will ignore any fields in the query that are not defined in the schema of the model
    toJSON: { virtuals: true }, // when the data is outputed in format json we want the virtuals to apear in the out put
    toObject: { virtuals: true }, // when ............................ objects ...
  },
)

const NonAvailibility = mongoose.model('NonAvailibility', nonAvailibilitySchema)

module.exports = NonAvailibility
