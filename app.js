const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Hunter = require('./models/hunter.js')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/hunter', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

app.get('/', (req, res) => {
  Hunter.find()
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants })
    })
    .catch(error => console.log(error))
})

app.get('/restaurants/:restId', (req, res) => {
  const id = req.params.restId
  return Hunter.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restId/edit', (req, res) => {
  const id = req.params.restId
  return Hunter.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restId/edit', (req, res) => {
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

app.post('/restaurants/:restId/delete', (req, res) => {
  return Hunter.findById(req.params.restId)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/create', (req, res) => {
  return res.render('create')
})

app.post('/create', (req, res) => {
  let restaurant = {}
  restaurant = Object.assign(restaurant, req.body)

  Hunter.create(restaurant, function (error) {
    if (error) {
      return res.render('create', { restaurant, errorMsg: true })
    } else {
      return res.redirect('/')
    }
  })
})

app.get('/search', (req, res) => {
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

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`)
})
