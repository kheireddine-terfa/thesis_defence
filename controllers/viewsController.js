const Announce = require('../models/announceModel')
const Premise = require('../models/premiseModel')
const axios = require('axios')
const Speciality = require('../models/specialityModel')
const Field = require('../models/fieldModel')

//--------------------- controllers : ------------------
exports.getAllAnnounces = async (req, res) => {
  const announces = await Announce.find()
  res.status(200).json({
    status: 'success',
    data: {
      announces,
    },
  })
}
//---------------:

exports.getPremise = async (req, res) => {
  const premiseId = req.params.id
  const premise = await Premise.findById(premiseId)
  res.status(200).json({
    status: 'success',
    premise,
  })
}
//--------------:
exports.getIndexPageProfessor = (req, res) => {
  res.status(200).render('index', {
    layout: 'professorLayout',
  })
}
//--------------:
exports.getProfessorLoginForm = (req, res) => {
  res.status(200).render('login', {
    layout: false,
  })
}
//--------------:
exports.getAddThesisForm = async (req, res) => {
  const specialities = await Speciality.find()
  const fields = await Field.find()
  res.status(200).render('ajoutertheme', {
    layout: 'professorLayout',
    specialities,
    fields,
  })
}
//----------------:
exports.getProfessorInfos = async (req, res) => {
  const user = req.user
  res.status(200).render('users-profile', {
    layout: 'professorLayout',
    user,
  })
}
