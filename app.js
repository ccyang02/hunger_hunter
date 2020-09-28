const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const data = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  const restaurants = data.results
  res.render('index', { restaurants })
})

app.get('/restaurants/:rest_id', (req, res) => {
  const restaurant = data.results.find(element => element.id.toString() === req.params.rest_id)
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = data.results.filter(element => {
    return element.name.toLowerCase().includes(keyword) ||
      element.category.toLowerCase().includes(keyword) ||
      element.location.toLowerCase().includes(keyword) ||
      element.description.toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`)
})
