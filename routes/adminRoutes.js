const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const viewsController = require('../controllers/viewsController')
//-----------------------------authentication:

router.post('/signup', authController.signup)
router.get('/logout', authController.logout)
//-----------------------------speciality:
router.use(authController.protect)
router.route('/speciality').post(adminController.addSpeciality)
router.route('/specialities').get(adminController.getAllSpeciality)
router
  .route('/speciality/:id')
  .get(adminController.getSpeciality)
  .delete(adminController.deleteSpeciality)
  .patch(adminController.updateSpeciality)
//-----------------------------field:
router.route('/field').post(adminController.addField)
router.route('/fields').get(adminController.getAllFields)
router
  .route('/field/:id')
  .get(adminController.getField)
  .delete(adminController.deleteField)
  .patch(adminController.updateField)
//-----------------------------student:
router.route('/student').post(adminController.addAndSignUpStudent)
router.route('/students').get(adminController.getAllStudents)
router
  .route('/student/:id')
  .get(adminController.getStudent)
  .delete(adminController.deleteStudent)
  .patch(adminController.updateStudent)
//-----------------------------professor:
router.route('/professor').post(adminController.addAndSignUpProfessor)
router.route('/professors').get(adminController.getAllProfessors)

router
  .route('/professor/:id')
  .get(adminController.getProfessor)
  .delete(adminController.deleteProfessor)
  .patch(adminController.updateProfessor)
//-----------------------------binome:
router.route('/binome').post(adminController.addAndSignUpBinome)
router.route('/binomes').get(adminController.getAllBinomes)
router
  .route('/binome/:id')
  .get(adminController.getBinome)
  .patch(adminController.updateBinome)
  .delete(adminController.deleteBinome)
//-----------------------------announce:
router.route('/announce').post(adminController.addAnnounce)
router
  .route('/announce/:id')
  .get(adminController.getAnnounce)
  .patch(adminController.updateAnnounce)
  .delete(adminController.deleteAnnounce)
//-----------------------------premise:
router.route('/premise').post(adminController.addPremise)
router.route('/premises').get(adminController.getAllPremises)
router
  .route('/premise/:id')
  .delete(adminController.deletePremise)
  .get(adminController.getPremise)
  .patch(adminController.updatePremise)
//----------------------------- session :
router.route('/session').post(adminController.addSession)
router
  .route('/sessions')
  .get(adminController.getAllSession)
  .delete(adminController.deleteAllSessions)
router
  .route('/session/:id')
  .get(adminController.getSession)
  .patch(adminController.updateSession)
  .delete(adminController.deleteSession)
router
  .route('/non-availibilities')
  .get(adminController.getAllNonAvailibility)
  .post(adminController.addNonAvailibility)
router
  .route('/non-availibility/:id')
  .get(adminController.getNonAvailibility)
  .patch(adminController.updateNonAvailibility)
  .delete(adminController.deleteNonAvailibility)
router.route('/affected-theses').get(adminController.getAllAffectedTheses)
router.route('/proposed-theses').get(adminController.getAllProposedTheses)

module.exports = router
