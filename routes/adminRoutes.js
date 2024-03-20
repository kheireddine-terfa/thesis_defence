const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
//-----------------------------authentication:

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
//-----------------------------speciality:
router.use(authController.protect)
router
  .route('/speciality')
  .post(adminController.addSpeciality)
  .get(adminController.getAllSpeciality)
router.delete('/speciality/:id', adminController.deleteSpeciality)
//-----------------------------field:
router
  .route('/field')
  .post(adminController.addField)
  .get(adminController.getAllFields)
router
  .route('/field/:id')
  .get(adminController.getField)
  .delete(adminController.deleteField)
  .patch(adminController.updateField)
//-----------------------------student:
//.... add student
router.route('/student').get(adminController.getAllStudents)
router
  .route('/student/:id')
  .get(adminController.getStudent)
  .delete(adminController.deleteStudent)
  .patch(adminController.updateStudent)
//-----------------------------professor:
router.route('/professor').get(adminController.getAllProfessors)
router
  .route('/professor/:id')
  .get(adminController.getProfessor)
  .delete(adminController.deleteProfessor)
  .patch(adminController.combineFields, adminController.updateProfessor)
//-----------------------------binome:
//.... check these if it still work ... then go to selected thesis
router
  .route('/binome')
  .post(adminController.addAndSignUpBinome)
  .get(adminController.getAllBinome)
router
  .route('/binome/:id')
  .get(adminController.getBinome)
  .patch(adminController.updateBinome)
  .delete(adminController.deleteBinome)
//-----------------------------announce:
router
  .route('/announce')
  .post(adminController.addAnnounce)
  .get(adminController.getAllAnnounces)
router
  .route('/announce/:id')
  .get(adminController.getAnnounce)
  .patch(adminController.updateAnnounce)
  .delete(adminController.deleteAnnounce)
//-----------------------------premise:
router
  .route('/premise')
  .post(adminController.addPremise)
  .get(adminController.getAllPremises)
router.route('/premise/:id').delete(adminController.deletePremise)
module.exports = router
