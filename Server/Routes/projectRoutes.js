const express = require('express')
const router = express.Router()
const {getProjects, postProjects} = require('../Controllers/projectControllers')

router.get('/', getProjects)
router.post('/', postProjects)

module.exports = router