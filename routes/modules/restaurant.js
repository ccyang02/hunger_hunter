const express = require('express')
const router = express.Router()
const Hunter = require('../../models/hunter.js')

router.get('/:restId', (req, res) => {
  const id = req.params.restId
  return Hunter.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:restId/edit', (req, res) => {
  const id = req.params.restId
  return Hunter.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.post('/:restId/edit', (req, res) => {
  const id = req.params.restId
  return Hunter.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => {
      res.redirect(`/restaurants/${id}`)
    })
    .catch(error => console.log(error))
})

router.post('/:restId/delete', (req, res) => {
  return Hunter.findById(req.params.restId)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router