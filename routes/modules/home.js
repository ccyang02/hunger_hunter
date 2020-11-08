const express = require('express')
const router = express.Router()
const Hunter = require('../../models/hunter.js')

router.get('/', (req, res) => {
  const userId = req.user._id
  Hunter.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => {
      res.render('index', { restaurants })
    })
    .catch(error => console.log(error))
})

module.exports = router