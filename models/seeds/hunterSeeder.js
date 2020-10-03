const mongoose = require('mongoose')
const data = require('../../restaurant.json')
const Hunter = require('../hunter.js')

mongoose.connect('mongodb://localhost/hunter', {
  useNewUrlParser: true, useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb connection error!')
})
db.once('open', () => {
  console.log('mongo connected!')

  data.results.forEach(element => {
    Hunter.create(element)
  });
  console.log('Complete!')
})
