const express = require('express')
const router = express.Router()
const {getUsers, postUser, updateUser} = require('../Controllers/userControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.get('/', verifyToken, getUsers)
router.post('/', verifyToken, postUser)
router.put('/:id', verifyToken, updateUser)

module.exports = router