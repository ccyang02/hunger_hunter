const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
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
  if (!regInfo.name || !regInfo.email || !regInfo.password || !regInfo.confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (regInfo.password !== regInfo.confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    regInfo.errors = errors
    return res.render('register', regInfo)
  }
  User.findOne({ email: regInfo.email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
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
        .catch(error => console.log(error))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出。')
  res.redirect('/users/login')
})

module.exports = router