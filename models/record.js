const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  categoty: {
    type: String,
  },
  date: {
    type: Date
  },
  amount: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)