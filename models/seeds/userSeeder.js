const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const User = require('../user')

const SEED_USERS = [
  {
    name: 'user01',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user02',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => {
      return Promise.all(SEED_USERS.map(user => bcrypt.hash(user.password, salt)))
    })
    .then(hash => {
      SEED_USERS.map((user, i) => user.password = hash[i])
      return User.insertMany(SEED_USERS)
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})
