const mongoose = require('mongoose')
// const config = require('./config.json')

mongoPath=process.env.mongoPath
// mongoPath=config.mongoPath
module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  return mongoose
}