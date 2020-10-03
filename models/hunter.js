const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hunterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
  },
  category: {
    type: String,
  },
  images: {
    type: String,
  },
  location: {
    type: String,
  },
  phone: {
    type: String,
  },
  google_map: {
    type: String,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Hunter', hunterSchema)