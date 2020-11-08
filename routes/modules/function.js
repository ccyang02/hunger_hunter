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
  restaurant.userId = req.user._id // add info about corresponding data owner
  // console.log(`I got ${req.body}`)
  Hunter.create(restaurant, function (error) {
    if (error) {
      console.log(error)
      return res.render('create', { restaurant, errorMsg: true })
    } else {
      return res.redirect('/')
    }
  })
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const userId = req.user._id
  return Hunter.find({ userId })
    .lean()
    .then(elements => elements.filter(element => {
      return element.name.toLowerCase().includes(keyword)
    }))
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

router.get('/sort/:query', (req, res) => {
  const tokens = req.params.query.split('-')
  let column, order, keywords
  // column: name, category, rating
  // order: asc, desc
  [column, order, ...keywords] = tokens
  const keyword = keywords.join('-')
  const userId = req.user._id
  Hunter.find({ userId })
    .lean()
    .sort({ [column]: order })
    .then(elements => elements.filter(element => {
      return element.name.toLowerCase().includes(keyword)
    }))
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

module.exports = router