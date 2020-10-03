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
      console.log(restaurants[0])
      res.render('index', { restaurants })
    })
    .catch(error => console.log(error))
})

app.get('/restaurants/:rest_id', (req, res) => {
  const id = req.params.rest_id
  return Hunter.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
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
