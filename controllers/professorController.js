//-------------------- declaration
const Field = require('../models/fieldModel')
const Professor = require('../models/professorModel')
const Speciality = require('../models/specialityModel')
const Thesis = require('../models/thesisModel')
const Binome = require('../models/binomeModel')
const Session = require('../models/sessionModel')
//------------------ controllers: --------------------------------
exports.addThesis = async (req, res) => {
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
  res.status(201).redirect('/professor/thesis')
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     thesis,
  //   },
  // })
}
//----------------------:

exports.updateThesis = async (req, res) => {
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
}
//----------------------:

exports.deleteThesis = async (req, res) => {
  const professor = Professor.findById(req.user._id)
  const thesisId = req.params.id
  const binomes = await Binome.find({ selectedThesis: thesisId })
  if (binomes.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message: 'you can not delete this! thesis is selected by binome',
    })
  }
  const thesis = await Thesis.findById(thesisId)
  if (!thesis) {
    return res.status(404).json({
      status: 'fail',
      message: 'Thesis not found',
    })
  }

  // Check if the thesis is approved in any binome
  const binomesWithApprovedThesis = await Binome.find({
    ApprovedThesis: thesisId,
  })
  if (binomesWithApprovedThesis.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message: 'Cannot delete the thesis because it is approved for binome',
    })
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
}
//----------------------:

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
//----------------------:

exports.getProsessorTheses = async (req, res) => {
  const professorId = req.user._id
  const professor = await Professor.findById(professorId)
  const theses = professor.theses
  // res.status(200).json({
  //   theses,
  // })
  res
    .status(200)
    .render('Enseignant-listeTheme', { layout: 'professorLayout', theses })
}
//----------------------:

exports.getCandidacyApp = async (req, res) => {
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
}
//----------------------:

exports.validateCandidacy = async (req, res) => {
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
    return res.status(403).json({
      status: 'fail',
      message: 'session has not been created yet',
    })
  }

  res.status(200).json({
    status: 'success',
    updatedBinome,
    updatedProfessor,
    currentThesis,
  })
}
//----------------:
exports.getSupervisedBinomes = async (req, res) => {
  const professorId = req.user._id
  const professor = await Professor.findById(professorId)
  const supervisedBinomes = professor.supervisedBinomes
  res.status(200).render('Enseignant-listeBinom', {
    layout: 'professorLayout',
    supervisedBinomes,
  })
}
