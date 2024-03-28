const express = require('express')
const router = express.Router()
const viwesController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

router.route('/announce').get(viwesController.getAllAnnounces)
router.route('/premise/:id').get(viwesController.getPremise)
//------------------ professor:
router.route('/professor').get(viwesController.getIndexPageProfessor)
router.route('/professor/login').get(viwesController.getProfessorLoginForm)
router.route('/professor/add-thesis').get(viwesController.getAddThesisForm)
router
  .route('/professor/update-thesis/:id')
  .get(viwesController.getUpdateThesisForm)

router
  .route('/professor/profile')
  .get(authController.protect, viwesController.getProfessorInfos)

module.exports = router
