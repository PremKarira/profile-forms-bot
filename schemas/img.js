const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const img = mongoose.Schema({
  _id: reqString,
  img: reqString,
})

module.exports = mongoose.model('img', img)