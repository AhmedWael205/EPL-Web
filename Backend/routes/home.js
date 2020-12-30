const jwt = require('jsonwebtoken')
const _ = require('lodash')
const { User } = require('../models/user')
const mongoose = require('mongoose')
const config = require('config')
const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {
    const token = req.headers['token']

    if (!token) return res.status(404).send({ msg: 'UserNotFound' })

    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    let user = await User.findOne({ Username: decoded.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })

    return res.send({Username:decoded.Username, Role:decoded.Role})

})

module.exports = router