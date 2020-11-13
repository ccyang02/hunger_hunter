const express = require('express')
const methodOverride = require('method-override')
const Hunter = require('../../models/hunter.js')
const router = express.Router()
const data = require('../../models/data/default')
const { body, validationResult } = require('express-validator')

router.use(methodOverride('_method'))

router.get('/:restId', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.restId
  return Hunter.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.get('/:restId/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restId
  return Hunter.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant, selector: data.categories }))
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.put('/:restId/edit', [
  body('name').notEmpty(),
  body('rating').notEmpty(),
  body('description').notEmpty()
], (req, res) => {
  const errors = validationResult(req)
  const userId = req.user._id
  const _id = req.params.restId

  if (!errors.isEmpty()) {
    return res.redirect(`/restaurants/${_id}/edit`)
  } else {
    const updateRest = req.body
    updateRest.userId = userId
    Hunter.findOne({ _id, userId })
      .then(restaurant => {
        Object.assign(restaurant, updateRest)
        return restaurant.save()
      })
      .then(() => {
        return res.redirect(`/restaurants/${_id}`)
      })
      .catch(error => {
        console.log(error)
        return res.end()
      })
    // return Hunter.findByIdAndUpdate(_id, updateRest, { new: true }) // 遇到一個問題，當要直接用 Hunter 時會造成 Schema 物件直接更新存在安全性
    //   .then(() => {
    //     res.redirect(`/restaurants/${_id}`)
    //   })
    //   .catch(error => console.log(error))
  }
})

router.delete('/:restId/delete', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restId
  return Hunter.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

module.exports = router