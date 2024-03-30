const express = require('express')
const router = express.Router()
const viwesController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

router.route('/announce').get(viwesController.getAllAnnounces)
router.route('/premise/:id').get(viwesController.getPremise)
//------------------ professor:
router.route('/professor/login').get(viwesController.getProfessorLoginForm)
router.route('/binome/login').get(viwesController.getBinomeLoginForm)
router.use(authController.protect)
router.route('/professor').get(viwesController.getIndexPageProfessor)
router.route('/professor/add-thesis').get(viwesController.getAddThesisForm)
router
  .route('/professor/update-thesis/:id')
  .get(viwesController.getUpdateThesisForm)

router.route('/professor/profile').get(viwesController.getProfessorInfos)
//-------------------------- binome:
router.route('/binome').get(viwesController.getIndexPageBinome)
router.route('/binome/selected-theses').get(viwesController.getSelectedTheses)
router.route('/binome/profile').get(viwesController.getBinomeInfos)

module.exports = router
