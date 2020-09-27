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
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = data.results.filter(element => JSON.stringify(element).includes(req.query.keyword))
  // how to speed up when there are a lot of data?

  res.render('index', { restaurants: restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`)
})
