const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
// const studentController = require('../controllers/studentController')
const binomeController = require('../controllers/binomeController')
router.route('/login').post(authController.login)
router.use(authController.protect)

router.get('/thesis', binomeController.getAllTheses)
// nominate to thesis :
// router.route('/thesis-nominate').post(studentController.nominateToThesis)
router.route('/thesis-nominate').post(binomeController.nominateToThesis)
router
  .route('/thesis-cancel-nominate')
  .post(binomeController.cancelNominationToThesis)
module.exports = router
