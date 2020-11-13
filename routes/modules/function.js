const express = require('express')
const router = express.Router()
const Hunter = require('../../models/hunter.js')
const bodyParser = require('body-parser')
const data = require('../../models/data/default')
const msgStatus = require('../../models/data/messages')
const { body, validationResult } = require('express-validator')

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/create', (req, res) => {
  return res.render('create', { categories: data.categories })
})

router.post('/create', [
  body('name').notEmpty(),
  body('rating').notEmpty(),
  body('description').notEmpty()
], (req, res) => {
  const errors = validationResult(req)
  let restaurant = {}
  restaurant = Object.assign(restaurant, req.body)

  if (!errors.isEmpty()) {
    const columns = errors.errors.map(error => data.columns[error.param]).join(', ')
    const errorMsg = msgStatus.createdFail.incomplete + columns
    return res.render('create', { restaurant, errorMsg, categories: data.categories })
  }

  restaurant.userId = req.user._id // add info about corresponding data owner
  Hunter.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.render('create', { restaurant, errorMsg: true })
    })
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const userId = req.user._id

  const query =
  {
    $or: [
      { name: { $regex: keyword, $options: '$i' }, userId },
    ]
  }
  return Hunter.find(query)
    .lean()
    .then(restaurants => {
      return res.render('index', { restaurants, keyword })
    })
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.get('/sort/:query', (req, res) => {
  const tokens = req.params.query.split('-')
  let column, order, keywords
  // column: name, category, rating
  // order: asc, desc
  [column, order, ...keywords] = tokens
  const keyword = keywords.join('-')
  const userId = req.user._id

  const query =
  {
    $or: [
      { name: { $regex: keyword, $options: '$i' }, userId },
    ],
  }

  Hunter.find(query)
    .lean()
    .sort({ [column]: order })
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

module.exports = router