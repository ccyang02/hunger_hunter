const express = require('express')
const router = express.Router()
const Hunter = require('../../models/hunter.js')
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/create', (req, res) => {
  return res.render('create')
})

router.post('/create', (req, res) => {
  let restaurant = {}
  restaurant = Object.assign(restaurant, req.body)
  console.log(`I got ${req.body}`)
  Hunter.create(restaurant, function (error) {
    if (error) {
      // console.log(error)
      return res.render('create', { restaurant, errorMsg: true })
    } else {
      return res.redirect('/')
    }
  })
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  return Hunter.find()
    .lean()
    .then(elements => elements.filter(element => {
      return element.name.toLowerCase().includes(keyword) ||
        element.category.toLowerCase().includes(keyword) ||
        element.location.toLowerCase().includes(keyword) ||
        element.description.toLowerCase().includes(keyword)
    }))
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

module.exports = router