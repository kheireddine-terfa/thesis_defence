const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const professorController = require('../controllers/professorController')
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.use(authController.protect)
router
  .route('/theme')
  .post(professorController.addTheme)
  .get(professorController.getProsessorThemes) //.....
router
  .route('/theme/:id')
  .get(professorController.getTheme)
  .patch(professorController.updateTheme)
  .delete(professorController.deleteTheme)
module.exports = router
