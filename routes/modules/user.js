const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', (req, res) => { })

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => { })

router.get('/logout', (req, res) => { })

module.exports = router