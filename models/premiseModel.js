const mongoose = require('mongoose')
const premiseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'premise must have a name'],
  },
})
const Premise = mongoose.model('Premise', premiseSchema)
module.exports = Premise
