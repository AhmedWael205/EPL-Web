const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const { User } = require('../models/user')
const mongoose = require('mongoose')
const config = require('config')
const express = require('express')
const router = express.Router()


router.get('/', auth,async (req, res) => {
    
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })

    return res.send({Username:req.user.Username, Role:req.user.Role})

})

module.exports = router