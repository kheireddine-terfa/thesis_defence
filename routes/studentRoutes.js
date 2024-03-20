const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const studentController = require('../controllers/studentController')
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/thesis', studentController.getAllTheses)
// nominate to thesis :
router.route('/thesis-nominate').post(studentController.nominateToThesis)
module.exports = router
