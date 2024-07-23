//-------------------- declaration (import)
const Field = require('../models/fieldModel')
const Professor = require('../models/professorModel')
const Speciality = require('../models/specialityModel')
const Thesis = require('../models/thesisModel')
const Binome = require('../models/binomeModel')
const Session = require('../models/sessionModel')
const thesisDefence = require('../models/thesisDefenceModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')
//------------------ controllers: --------------------------------
exports.addThesis = catchAsync(async (req, res, next) => {
  const { title, description, fieldId, specialityId } = req.body
  const field = await Field.findById(fieldId)
  const speciality = await Speciality.findById(specialityId)
  if (!field || !speciality) {
    return next(
      new AppError(
        'opps ! something went wrong we do not found a the field or speciality',
        404,
      ),
    )
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
  res.status(201).redirect('/professor/thesis')
})
//----------------------:

exports.updateThesis = catchAsync(async (req, res, next) => {
  const thesisId = req.params.id
  const thesis = await Thesis.findById(thesisId)
  const { title, description, field, speciality } = req.body
  thesis.title = title
  thesis.description = description
  thesis.field = field
  thesis.speciality = speciality
  await thesis.save()
  res.status(200).json({
    status: 'success',
    data: {
      thesis,
    },
  })
})
//----------------------:

exports.deleteThesis = catchAsync(async (req, res, next) => {
  const professor = Professor.findById(req.user._id)
  const thesisId = req.params.id
  const binomes = await Binome.find({ selectedThesis: thesisId })
  if (binomes.length > 0) {
    return next(
      new AppError(
        'you can not delete this! thesis is selected by binome',
        403,
      ),
    )
  }
  const thesis = await Thesis.findById(thesisId)
  if (!thesis) {
    return next(new AppError('Thesis not found', 404))
  }

  // Check if the thesis is approved in any binome
  const binomesWithApprovedThesis = await Binome.find({
    ApprovedThesis: thesisId,
  })
  if (binomesWithApprovedThesis.length > 0) {
    return next(
      new AppError(
        'Cannot delete the thesis because it is approved for binome',
        403,
      ),
    )
  }
  // Remove the thesis from the selectedThesis array of all binomes
  await Binome.updateMany(
    { selectedThesis: thesisId },
    { $pull: { selectedThesis: thesisId } },
  )
  // Remove the thesis from the theses array of professor
  await professor.updateMany({ $pull: { theses: thesisId } })
  // Delete the thesis
  await Thesis.findByIdAndDelete(thesisId)

  res.status(204).json({
    status: 'success',
    message: 'Thesis deleted successfully',
  })
})
//----------------------:

exports.getThesis = catchAsync(async (req, res, next) => {
  const thesisId = req.params.id
  const thesis = await Thesis.findById(thesisId)
  res.status(200).json({
    status: 'success',
    data: {
      thesis,
    },
  })
})
//----------------------:

exports.getProsessorTheses = catchAsync(async (req, res, next) => {
  const professorId = req.user._id
  const professor = await Professor.findById(professorId)
  const theses = professor.theses
  res
    .status(200)
    .render('Enseignant-listeTheme', { layout: 'professorLayout', theses })
})
//----------------------:

exports.getCandidacyApp = catchAsync(async (req, res, next) => {
  const professorId = req.user._id
  // Find the professor by ID
  const professor = await Professor.findById(professorId)
  const theses = professor.theses
  // Extract the IDs of the proposed theses by the professor
  const proposedThesisIds = theses.map((thesis) => thesis._id)

  // Aggregation pipeline to find binomes with selected theses matching proposed theses
  const candidacyApplications = await Binome.aggregate([
    // Match binomes with selected theses matching proposed theses
    {
      $match: {
        selectedThesis: { $in: proposedThesisIds },
      },
    },
    // Unwind selectedThesis array to create a separate document for each selected thesis
    { $unwind: '$selectedThesis' },
    // Match selected theses that match proposed theses
    {
      $match: {
        selectedThesis: { $in: proposedThesisIds },
      },
    },
    // Lookup to fetch the details of selected thesis
    {
      $lookup: {
        from: 'theses',
        localField: 'selectedThesis',
        foreignField: '_id',
        as: 'selectedThesisDetails',
      },
    },

    {
      $project: {
        _id: 1,
        userName: 1,
        email: 1,
        selectedThesis: { $arrayElemAt: ['$selectedThesisDetails', 0] },
      },
    },
  ])
  // console.log(candidacyApplications)
  res.status(200).render('Enseignant-affectertheme', {
    layout: 'professorLayout',
    candidacyApplications,
  })
})
//----------------------:

exports.validateCandidacy = catchAsync(async (req, res, next) => {
  //1- find the binome by id and update approvedthesis field to the current selected thesis:
  //2- delete all the Candidacy applications made by this binome
  const professorId = req.user._id
  const { binomeId, thesisId } = req.body
  const updatedBinome = await Binome.findByIdAndUpdate(
    binomeId,
    {
      $set: { ApprovedThesis: thesisId, selectedThesis: [] },
    },
    { new: true },
  )
  //3- delete all the Candidacy applications by binome's for this thesis:
  await Binome.updateMany(
    { selectedThesis: thesisId },
    { $pull: { selectedThesis: thesisId } },
  )
  //4 add this binome to supervisedBinomes array:
  const updatedProfessor = await Professor.findByIdAndUpdate(
    professorId,
    { $push: { supervisedBinomes: binomeId } },
    { new: true },
  )
  //5 chnage the affected attibut in thesis model :
  const currentThesis = await Thesis.findByIdAndUpdate(thesisId, {
    affected: true,
    binome: binomeId,
    professor: professorId,
  })
  // reference the the thesis to normal session :
  const normalSession = await Session.find({ sessionType: 'normal' })
  if (normalSession) {
    const updatedThesis = await Thesis.findByIdAndUpdate(
      thesisId,
      {
        session: normalSession[0]._id,
      },
      {
        new: true,
        runValidators: true,
      },
    )
  } else {
    return next(new AppError('session has not been created yet', 403))
  }

  res.status(200).json({
    status: 'success',
    updatedBinome,
    updatedProfessor,
    currentThesis,
  })
})
//----------------:
exports.getSupervisedBinomes = catchAsync(async (req, res, next) => {
  const professorId = req.user._id
  const professor = await Professor.findById(professorId)
  const supervisedBinomes = professor.supervisedBinomes
  res.status(200).render('Enseignant-listeBinom', {
    layout: 'professorLayout',
    supervisedBinomes,
  })
})

exports.getDefences = catchAsync(async (req, res, next) => {
  const professorId = req.user._id

  const defencesEncadrant = await thesisDefence.find().populate({
    path: 'thesis',
    populate: {
      path: 'professor jury binome',
      populate: { path: 'professor1 professor2' },
    },
  })

  const filteredDefences = defencesEncadrant.filter((defence) => {
    return (
      defence.thesis.professor &&
      defence.thesis.professor._id.toString() === professorId.toString()
    )
  })

  console.log(filteredDefences.map((d) => d.thesis.binome)) // Afficher les informations du binome pour vérification

  const defencesSupervesorPresident = defencesEncadrant.filter((defence) => {
    return (
      defence.thesis.jury.professor1 &&
      defence.thesis.jury.professor1._id.toString() === professorId.toString()
    )
  })

  const defencesSupervesorMember = defencesEncadrant.filter((defence) => {
    return (
      defence.thesis.jury.professor2 &&
      defence.thesis.jury.professor2._id.toString() === professorId.toString()
    )
  })

  res.status(200).render('Enseignant-consulterSoutenance', {
    layout: 'professorLayout',
    filteredDefences,
    defencesSupervesorPresident,
    defencesSupervesorMember,
  })
})
