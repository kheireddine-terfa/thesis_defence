const Binome = require('../models/binomeModel')
const Student = require('../models/studentModel')
const Thesis = require('../models/thesisModel')
const ThesisDefence = require('../models/thesisDefenceModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')

//-------------------- controllers : ---------------------
exports.nominateToThesis = catchAsync(async (req, res, next) => {
  const thesisId = req.body.thesisId
  // Find the student by ID
  const binome = await Binome.findById(req.user._id)
  // Check if the student has already selected the maximum number of thesis
  if (binome.selectedThesis.length >= 5) {
    return next(new AppError('Maximum number of thesis selected', 400))
  }

  // Find the thesis by ID
  const thesis = await Thesis.findById(thesisId)

  // Check if the thesis is found
  if (!thesis) {
    return next(new AppError('Thesis not found', 404))
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
})
//--------------------- :
exports.cancelNominationToThesis = catchAsync(async (req, res, next) => {
  const thesisId = req.body.thesisId
  // Find the student by ID
  const binome = await Binome.findById(req.user._id)

  // Find the thesis by ID
  const thesis = await Thesis.findById(thesisId)

  // Check if the thesis is found
  if (!thesis) {
    return next(new AppError('Thesis not found', 404))
  }

  // Add the thesis ID to the student's selectedThesis array
  binome.selectedThesis.pull(thesisId)
  // Save the student
  await binome.save()
  return res.status(200).json({
    status: 'success',
    message: 'Thesis selected successfully',
    thesisNumber: binome.selectedThesis.length,
  })
})
//--------------------- :
exports.getAllTheses = catchAsync(async (req, res, next) => {
  const binome = await Binome.findById(req.user._id)
  const studentId = binome.student1
  const student = await Student.findById(studentId)
  const speciality = student.speciality
  const theses = await Thesis.find({ speciality: speciality, affected: false })
  const selectedThesis = binome.selectedThesis
  const isSelectedArray = theses.map((thesis) =>
    selectedThesis.some(
      (selected) => selected._id.toString() === thesis._id.toString(),
    ),
  )
  res.status(200).render('Etudiant-pages-liste-d-themes', {
    layout: 'binomeLayout',
    theses,
    isSelectedArray,
    binome,
  })
})
exports.getDefence = catchAsync(async (req, res, next) => {
  const binome = await Binome.findById(req.user._id)

  const thesis = await Thesis.findById(binome.ApprovedThesis._id).populate(
    'professor',
  )
  // const thesisId = thesis._id
  const thesisDefence = await ThesisDefence.findOne({ thesis: thesis._id })
  res.status(200).render('binome-soutenance', {
    layout: 'binomeLayout',
    thesisDefence,
    thesis,
  })
})
