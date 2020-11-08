const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const routes = require('./routes')
const Hunter = require('./models/hunter.js')

const port = 3000
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'HiiiiyaSecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

const usePassport = require('./config/passport')
usePassport(app)

mongoose.connect('mongodb://localhost/hunter', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection error!')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`)
})
