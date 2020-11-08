const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const data = require('../../restaurant.json')
const Hunter = require('../hunter')
const User = require('../user')

const RESTAURANTS = data.results

db.once('open', () => {
  User.find()
    .then(users => {
      RESTAURANTS.map((restaurant, i) => {
        if (i > 5) {
        } else if (i > 2) { // #4 #5 #6
          restaurant.userId = users[1]._id
        } else { // #1 #2 #3
          restaurant.userId = users[0]._id
        }
        return restaurant
      })
      return RESTAURANTS.splice(0, 6)
    })
    .then(restaurants => {
      return Hunter.create(restaurants)
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})

// db.once('open', () => {
  // bcrypt
  //   .genSalt(10)
  //   .then(salt => {
  //     return Promise.all(SEED_USERS.map(user => bcrypt.hash(user.password, salt)))
  //   })
  //   .then(hash => {
  //     SEED_USERS.map((user, i) => user.password = hash[i])
  //     return User.insertMany(SEED_USERS).find({ "email": { $in: [SEED_USERS[0].email, SEED_USERS[1].email] } })
  //       .then(output => console.log('***', output))
  //   })
    // .then(() => {
    //   User.find({ "email": { $in: [SEED_USERS[0].email, SEED_USERS[1].email] } })
    //     .then(output => console.log('***', output))
    // })
    // .then(() => {
    //   console.log('done.')
      // process.exit()
    // })

  // .then(() => {
  //   RESTAURANTS.map((restaurant, i) => {
  //     restaurant.userId
  //     return restaurant
  //   })
  //   Hunter.create()
  // })
  // .then(() => {
  //   console.log('done.')
  //   // process.exit()
  // })

// })
