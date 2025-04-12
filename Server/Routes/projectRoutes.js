const express = require('express')
const router = express.Router()
const {getProjects, postProjects, updateProject} = require('../Controllers/projectControllers')

router.get('/', getProjects)
router.post('/', postProjects)
router.put('/', updateProject)

module.exports = router