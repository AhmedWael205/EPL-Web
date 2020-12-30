const winston = require('winston')
const mongoose = require('mongoose')
const config = require('config')

module.exports = function () {
  const db = config.get('dbUrl')
  mongoose
    .connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => winston.info(`Connected to MongoDB...`))
}
