const express = require('express')
const router = express.Router()
const {getProjects, postProjects, updateProject} = require('../Controllers/projectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.get('/', verifyToken, getProjects)
router.post('/', verifyToken, postProjects)
router.put('/', verifyToken, updateProject)

module.exports = router