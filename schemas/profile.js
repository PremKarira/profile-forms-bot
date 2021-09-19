const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profile = mongoose.Schema({
  _id: reqString,
  dTag: reqString,
  SName: reqString,
  SNo: reqString,
  Branch: reqString,
  Year: reqString,
  Distro: reqString,
  Kernel: reqString,
  Terminal: reqString,
  Editor: reqString,
  Shell: reqString,
  WM: reqString,
  Bar: reqString,
  Resolution: reqString,
  Display: reqString,
  GTK3Theme: reqString,
  GTKIconTheme: reqString,
  CPU: reqString,
  GPU: reqString,
  Memory: reqString,
  IIITB: reqString,
  img: reqString,
  git: reqString,
  df: reqString,
  // OS: reqString,
})

module.exports = mongoose.model('profile', profile)