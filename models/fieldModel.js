const mongoose = require('mongoose')
const Professor = require('./professorModel')
const fieldSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'field must have a title'],
  },
})
// Middleware to remove reference to deleted field from Professor model
fieldSchema.pre('remove', async function (next) {
  // Remove this field from all professors
  await Professor.updateMany(
    { fields: this._id }, // Find professors referencing this field
    { $pull: { fields: this._id } }, // Pull this field from their fields array
  )
  next()
})
const Field = mongoose.model('Field', fieldSchema)
module.exports = Field
