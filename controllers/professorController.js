//-------------------- declaration
const Field = require('../models/fieldModel')
const Professor = require('../models/professorModel')
const Speciality = require('../models/specialityModel')
const Thesis = require('../models/thesisModel')
const Binome = require('../models/binomeModel')
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
  res.status(201).json({
    status: 'success',
    data: {
      thesis,
    },
  })
}
//----------------------:

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
//----------------------:

exports.deleteThesis = async (req, res) => {
  const thesisId = req.params.id
  const updatedThesis = await Thesis.findByIdAndDelete(thesisId)
  res.status(204).json({
    status: 'success',
    message: 'thesis deleted successfully',
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
  res.status(200).json({
    status: 'success',
    data: {
      theses,
    },
  })
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

  res.status(200).json({
    status: 'success',
    candidacyApplications,
  })
}
//----------------------:

exports.validateCandidacy = async (req, res) => {
  //1- find the binome by id and update approvedthesis field to the current selected thesis:
  //2- delete all the Candidacy applications made by this binome

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
  res.status(200).json({
    status: 'success',
    updatedBinome,
  })
}
