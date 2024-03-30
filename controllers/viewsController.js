const Announce = require('../models/announceModel')
const Premise = require('../models/premiseModel')
const Speciality = require('../models/specialityModel')
const Field = require('../models/fieldModel')
const Thesis = require('../models/thesisModel')
const Binome = require('../models/binomeModel')

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
//--------------: professor
exports.getIndexPageProfessor = (req, res) => {
  res.status(200).render('Enseignant-index', {
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
  res.status(200).render('Enseignant-ajoutertheme', {
    layout: 'professorLayout',
    specialities,
    fields,
  })
}
//----------------:
exports.getUpdateThesisForm = async (req, res) => {
  const specialities = await Speciality.find()
  const fields = await Field.find()
  const thesis = await Thesis.findById(req.params.id)
  res.render('Enseignant-modifiertheme', {
    layout: 'professorLayout',
    specialities,
    fields,
    thesis,
  })
}
//----------------:
exports.getProfessorInfos = async (req, res) => {
  const user = req.user
  res.status(200).render('Enseignant-users-profile', {
    layout: 'professorLayout',
    user,
  })
}
//---------------: binome
exports.getIndexPageBinome = (req, res) => {
  res.status(200).render('Etudiant-index', {
    layout: 'binomeLayout',
  })
}
//----------------
exports.getBinomeLoginForm = (req, res) => {
  res.status(200).render('login', {
    layout: false,
  })
}
//----------------:
exports.getBinomeInfos = async (req, res) => {
  const user = req.user
  // console.log(user)
  res.status(200).render('Etudiant-users-profile', {
    layout: 'binomeLayout',
    user,
  })
}
//---------------- :
exports.getSelectedTheses = async (req, res) => {
  const binome = await Binome.findById(req.user._id)
  const selectedTheses = binome.selectedThesis
  const approvedThesis = binome.ApprovedThesis
  res.status(200).render('Etudiant-pages-selected-theses', {
    layout: 'binomeLayout',
    selectedTheses,
    approvedThesis,
  })
}
