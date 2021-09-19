const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const git = mongoose.Schema({
  _id: reqString,
  git: reqString,
})

module.exports = mongoose.model('git', git)