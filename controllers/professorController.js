const Field = require('../models/fieldModel')
const Professor = require('../models/professorModel')
const Speciality = require('../models/specialityModel')
const Thesis = require('../models/thesisModel')
exports.addThesis = async (req, res) => {
  console.log(req.user)
  const { title, description, fieldId, specialityId } = req.body
  const field = await Field.findById(fieldId)
  const speciality = await Speciality.findById(specialityId)
  if (!field || !speciality) {
    return res.status(404).json({
      status: 'fail',
      message:
        'opps ! something went wrong we do not found a the field or speciality',
    })
  }
  const thesis = await Thesis.create({
    title,
    description,
    field: fieldId,
    speciality: specialityId,
  })
  await Professor.findByIdAndUpdate(
    req.user._id,
    { $push: { theses: thesis._id } },
    { new: true },
  )
  res.status(201).json({
    status: 'success',
    data: {
      thesis,
    },
  })
}
exports.updateThesis = async (req, res) => {
  const thesisId = req.params.id
  const updatedThesis = await Thesis.findByIdAndUpdate(thesisId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      updatedThesis,
    },
  })
}
exports.deleteThesis = async (req, res) => {
  const thesisId = req.params.id
  const updatedThesis = await Thesis.findByIdAndDelete(thesisId)
  res.status(204).json({
    status: 'success',
    message: 'thesis deleted successfully',
  })
}
exports.getThesis = async (req, res) => {
  const thesisId = req.params.id
  const thesis = await Thesis.findById(thesisId)
  res.status(200).json({
    status: 'success',
    data: {
      thesis,
    },
  })
}
exports.getProsessorTheses = async (req, res) => {
  const professorId = req.user._id
  const professor = await Professor.findById(professorId)
  const theses = professor.theses
  res.status(200).json({
    status: 'success',
    data: {
      theses,
    },
  })
}
