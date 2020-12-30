const express = require('express')
const accounts = require('../routes/accounts')
const home = require('../routes/home')
const allOtherRoutes = require('../routes/allOtherRoutes')
const error = require('../middleware/error')

module.exports = function (app) {
  app.use(express.json())
  app.use(express.urlencoded())

  app.use('/accounts', accounts)
  app.use('/home', home)
  app.use('*', allOtherRoutes)
  app.use(error)
}
