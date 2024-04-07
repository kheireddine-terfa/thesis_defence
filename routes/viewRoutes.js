const express = require('express')
const router = express.Router()
const viwesController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

router.route('/announce').get(viwesController.getAllAnnounces)
router.route('/premise/:id').get(viwesController.getPremise)
//------------------ login forms:
router.route('/professor/login').get(viwesController.getProfessorLoginForm)
router.route('/binome/login').get(viwesController.getBinomeLoginForm)
router.route('/admin/login').get(viwesController.getAdminLoginForm)
router.route('/').get(viwesController.getIndexPage)

//--------------- handling post requests 'login' :
router.post('/admin/login', authController.login)
router.post('/professor/login', authController.login)
router.post('/binome/login', authController.login)
router.post('/logout', authController.logout)
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
//-------------------------- admin:
router.route('/admin').get(viwesController.getIndexPageAdmin)
router.route('/admin/profile').get(viwesController.getAdminInfos)
router.route('/admin/announce').get(viwesController.getAddAnnounceForm)
router.route('/admin/announces').get(viwesController.getAllAnnouncesAdmin)
router.route('/admin/binome').get(viwesController.getAddBinomeForm)
router.route('/admin/field').get(viwesController.getAddFieldForm)
router.route('/admin/professor').get(viwesController.getAddProfessorForm)
router.route('/admin/student').get(viwesController.getAddStudentForm)
router.route('/admin/speciality').get(viwesController.getAddSpecialityForm)
router.route('/admin/premise').get(viwesController.getAddPremiseForm)
router.route('/admin/session').get(viwesController.getAddSessionForm)
router
  .route('/admin/add-non-availibility')
  .get(viwesController.getAddNonAvailibilityForm)

module.exports = router
