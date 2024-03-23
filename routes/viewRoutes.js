const express = require('express')
const router = express.Router()
const viwesController = require('../controllers/viewsController')
router.route('/announce').get(viwesController.getAllAnnounces)
router.route('/premise/:id').get(viwesController.getPremise)
module.exports = router
