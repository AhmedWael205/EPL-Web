const express = require('express')
const accounts = require('../routes/accounts')
const home = require('../routes/home')
const admin = require('../routes/admin')
const manager = require('../routes/manager')
const allOtherRoutes = require('../routes/allOtherRoutes')
const error = require('../middleware/error')

module.exports = function (app) {
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  app.use('/accounts', accounts)
  app.use('/home', home)
  app.use('/admin', admin)
  app.use('/manager', manager)
  app.use('*', allOtherRoutes)
  app.use(error)
}
