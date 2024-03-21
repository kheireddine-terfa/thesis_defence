const Binome = require('../models/binomeModel')
const Thesis = require('../models/thesisModel')
//-------------------- controllers : ---------------------
exports.nominateToThesis = async (req, res) => {
  const thesisId = req.body.thesisId
  // Find the student by ID
  const binome = await Binome.findById(req.user._id)
  // Check if the student has already selected the maximum number of thesis
  if (binome.selectedThesis.length >= 5) {
    return res.status(400).json({
      status: 'fail',
      message: 'Maximum number of thesis selected',
    })
  }

  // Find the thesis by ID
  const thesis = await Thesis.findById(thesisId)

  // Check if the thesis is found
  if (!thesis) {
    return res.status(404).json({
      status: 'fail',
      message: 'Thesis not found',
    })
  }

  // Add the thesis ID to the student's selectedThesis array
  binome.selectedThesis.push(thesisId)
  // Save the student
  await binome.save()
  return res.status(200).json({
    status: 'success',
    message: 'Thesis selected successfully',
    thesisNumber: binome.selectedThesis.length,
  })
}
//--------------------- :

exports.getAllTheses = async (req, res) => {
  const theses = await Thesis.find()
  res.status(200).json({
    status: 'success',
    data: {
      theses,
    },
  })
}
