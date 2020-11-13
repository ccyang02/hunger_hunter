const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const msgStatus = require('../../models/data/messages')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}))

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  const regInfo = Object.assign(req.body)
  const errors = []
  if (!regInfo.email || !regInfo.password || !regInfo.confirmPassword) {
    errors.push({ message: msgStatus.registerFail.incomplete })
  }
  if (regInfo.password !== regInfo.confirmPassword) {
    errors.push({ message: msgStatus.registerFail.notMatched })
  }
  if (errors.length) {
    regInfo.errors = errors
    return res.render('register', regInfo)
  }
  User.findOne({ email: regInfo.email })
    .then(user => {
      if (user) {
        errors.push({ message: msgStatus.registerFail.duplicated })
        regInfo.errors = errors
        return res.render('register', regInfo)
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(regInfo.password, salt))
        .then(hash => {
          delete regInfo.confirmPassword
          regInfo.password = hash
          User.create(regInfo)
        })
        .then(() => res.redirect('/'))
        .catch(error => {
          console.log(error)
          return res.end()
        })
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', msgStatus.registerFail.pass)
  res.redirect('/users/login')
})

module.exports = router