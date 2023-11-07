const express = require('express')
const router = express.Router()

const { login, register, getAll, changePassword } = require('../controllers/users');
router.post('/login', login);
router.post('/register',register)
router.put('/changePassword',changePassword)

module.exports = router