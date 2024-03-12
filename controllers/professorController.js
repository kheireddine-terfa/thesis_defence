const Field = require('../models/fieldModel')
const Professor = require('../models/professorModel')
const Speciality = require('../models/specialityModel')
const Theme = require('../models/themeModel')
exports.addTheme = async (req, res) => {
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
  const theme = await Theme.create({
    title,
    description,
    field: fieldId,
    speciality: specialityId,
  })
  await Professor.findByIdAndUpdate(
    req.user._id,
    { $push: { themes: theme._id } },
    { new: true },
  )
  res.status(201).json({
    status: 'success',
    data: {
      theme,
    },
  })
}
exports.updateTheme = async (req, res) => {
  const themeId = req.params.id
  const updatedTheme = await Theme.findByIdAndUpdate(themeId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      updatedTheme,
    },
  })
}
exports.deleteTheme = async (req, res) => {
  const themeId = req.params.id
  const updatedTheme = await Theme.findByIdAndDelete(themeId)
  res.status(204).json({
    status: 'success',
    message: 'theme deleted successfully',
  })
}
exports.getTheme = async (req, res) => {
  const themeId = req.params.id
  const theme = await Theme.findById(themeId)
  res.status(200).json({
    status: 'success',
    data: {
      theme,
    },
  })
}
exports.getProsessorThemes = async (req, res) => {
  const professorId = req.user._id
  const professor = await Professor.findById(professorId)
  const themes = professor.themes
  res.status(200).json({
    status: 'success',
    data: {
      themes,
    },
  })
}
