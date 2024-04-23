const Announce = require('../models/announceModel')
const Premise = require('../models/premiseModel')
const Speciality = require('../models/specialityModel')
const Field = require('../models/fieldModel')
const Thesis = require('../models/thesisModel')
const Binome = require('../models/binomeModel')
const Student = require('../models/studentModel')
const Professor = require('../models/professorModel')

//--------------------- controllers : ------------------
exports.getIndexPage = (req, res) => {
  res.status(200).render('login_users', {
    layout: false,
  })
}
//------------------------:
exports.getAllAnnounces = async (req, res) => {
  const announces = await Announce.find()
  res.status(200).render('announces', {
    layout: false,
    announces,
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
  res.status(200).render('login-enseignant', {
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
  res.status(200).render('login-binome', {
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
//--------------------------   admin :
exports.getIndexPageAdmin = (req, res) => {
  res.status(200).render('Admin-accueil', {
    layout: 'admin-nav-bar',
  })
}
exports.getAdminLoginForm = (req, res) => {
  res.status(200).render('login-admin', {
    layout: false,
  })
}
exports.getAdminInfos = async (req, res) => {
  const user = req.user
  res.status(200).render('Admin-users-profile', {
    layout: 'Admin-nav-bar',
    user,
  })
}
exports.getAddAnnounceForm = (req, res) => {
  res.status(200).render('Admin-ajouter-annonce', {
    layout: 'admin-nav-bar',
  })
}
exports.getAllAnnouncesAdmin = async (req, res) => {
  const announces = await Announce.find()
  res.status(200).render('Admin-liste-annonce', {
    layout: 'admin-nav-bar',
    announces,
  })
}
exports.getAddBinomeForm = async (req, res) => {
  const students = await Student.find()
  res.status(200).render('Admin-ajouter-binome', {
    layout: 'admin-nav-bar',
    students,
  })
}
exports.getAddFieldForm = async (req, res) => {
  const fields = await Field.find()
  res.status(200).render('Admin-ajouter-domaine', {
    layout: 'admin-nav-bar',
    fields,
  })
}
exports.getAddProfessorForm = async (req, res) => {
  const fields = await Field.find()
  res.status(200).render('Admin-ajouter-enseignant', {
    layout: 'admin-nav-bar',
    fields,
  })
}
exports.getAddStudentForm = async (req, res) => {
  const specialities = await Speciality.find()
  res.status(200).render('Admin-ajouter-etudiant', {
    layout: 'admin-nav-bar',
    specialities,
  })
}
exports.getAddSpecialityForm = (req, res) => {
  res.status(200).render('Admin-ajouter-specialite', {
    layout: 'admin-nav-bar',
  })
}
exports.getAddPremiseForm = (req, res) => {
  res.status(200).render('Admin-ajouter-local', {
    layout: 'admin-nav-bar',
  })
}
exports.getAddSessionForm = (req, res) => {
  res.status(200).render('Admin-ajouter-session', {
    layout: 'admin-nav-bar',
  })
}
exports.getAddNonAvailibilityForm = async (req, res) => {
  const professors = await Professor.find()
  res.status(200).render('Admin-ajouter-non-disponibilite', {
    layout: 'admin-nav-bar',
    professors,
  })
}
exports.getUpdatePasswordForm = (req, res) => {
  if (req.originalUrl === '/admin/password') {
    res.status(200).render('Admin-modifier-password', {
      layout: 'Admin-nav-bar',
    })
  } else if (req.originalUrl === '/professor/password') {
    res.status(200).render('Enseignant-changerMotDePasse', {
      layout: 'professorLayout',
    })
  } else if (req.originalUrl === '/binome/password') {
    res.status(200).render('Etudiant-changer-le-mot-de-passe', {
      layout: 'binomeLayout',
    })
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'page not found',
    })
  }
}
