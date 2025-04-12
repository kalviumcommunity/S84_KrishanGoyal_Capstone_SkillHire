const express = require('express')
const router = express.Router()
const {getProjects} = require('../Controllers/projectControllers')

router.get('/', getProjects)

module.exports = router