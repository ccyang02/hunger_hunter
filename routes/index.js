const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const func = require('./modules/function')
const restaurant = require('./modules/restaurant')
const user = require('./modules/user')

router.use('/restaurants', restaurant)
router.use('/users', user)
router.use('/', home)
// 和功能性相關
router.use('/', func)

module.exports = router