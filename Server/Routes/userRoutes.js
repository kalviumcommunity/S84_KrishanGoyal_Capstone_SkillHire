const express = require('express')
const router = express.Router()
const {getUsers, postUser, updateUser} = require('../Controllers/userControllers')

router.get('/', getUsers)
router.post('/', postUser)
router.put('/', updateUser)

module.exports = router