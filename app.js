const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
// const mongoose = require('mongoose')

const routes = require('./routes')
const Hunter = require('./models/hunter.js')
const usePassport = require('./config/passport')

const port = 3000
const app = express()
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'HiiiiyaSecret',
  resave: false,
  saveUninitialized: true
}))

// remember it should be before routers
usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`)
})
