const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const df = mongoose.Schema({
  _id: reqString,
  df: reqString,
})

module.exports = mongoose.model('df', df)