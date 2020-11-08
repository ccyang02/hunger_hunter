const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', (req, res) => { })

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  console.log(req.body)
  const regInfo = Object.assign(req.body)
  User.findOne({ email: regInfo.email })
    .then(user => {
      if (user) {
        console.log('user already exists!')
        return res.render('register', regInfo)
      } else {
        delete regInfo.confirmPassword
        return User.create(regInfo)
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
})

router.get('/logout', (req, res) => { })

module.exports = router