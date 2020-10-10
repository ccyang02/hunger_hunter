const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const func = require('./modules/function')
const restaurant = require('./modules/restaurant')

// 和首頁相關
router.use('/', home)
// 和功能性相關
router.use('/', func)
// 和餐廳資訊相關
router.use('/restaurants', restaurant)

module.exports = router