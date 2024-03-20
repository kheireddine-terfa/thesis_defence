const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const professorController = require('../controllers/professorController')
//-------------authentication:
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.use(authController.protect)
//--------------------thesis:
router
  .route('/thesis')
  .post(professorController.addThesis)
  .get(professorController.getProsessorTheses)
router
  .route('/thesis/:id')
  .get(professorController.getThesis)
  .patch(professorController.updateThesis)
  .delete(professorController.deleteThesis)
module.exports = router
