const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const msgStatus = require('../../models/data/messages')
const User = require('../../models/user')
const { check, validationResult } = require('express-validator')

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

router.post('/register', [
  check('email').isEmail().withMessage(msgStatus.registerFail.incompleteMail),
  check('password').isLength({ min: 3, max: 8 }).withMessage(msgStatus.registerFail.incompletePwd),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(msgStatus.registerFail.notMatched)
      }
      return true
    }),

], (req, res) => {
  const errorResults = validationResult(req)
  if (!errorResults.isEmpty()) {
    const errors = errorResults.errors.map(error => error.msg).join(', ')
    req.body.regErr = errors
    return res.render('register', req.body)
  }

  // acquire data in need
  const regInfo = { email: req.body.email, password: req.body.password }
  if (req.body.name) regInfo.name = req.body.name

  User.findOne({ email: regInfo.email })
    .then(user => {
      if (user) {
        req.body.regErr = msgStatus.registerFail.duplicated
        return res.render('register', req.body)
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(regInfo.password, salt))
        .then(hash => {
          regInfo.password = hash
          return User.create(regInfo)
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