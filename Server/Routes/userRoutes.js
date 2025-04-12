const express = require('express')
const router = express.Router()
const {getUsers} = require('../Controllers/userControllers')

router.get('/', getUsers)

module.exports = router