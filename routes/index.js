const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const func = require('./modules/function')
const restaurant = require('./modules/restaurant')
const user = require('./modules/user')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')

router.use('/restaurants', authenticator, restaurant)
router.use('/users', user)
router.use('/auth', auth)
// 和功能性相關
router.use('/', authenticator, func)
router.use('/', authenticator, home)

module.exports = router