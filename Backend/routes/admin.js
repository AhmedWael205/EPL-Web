const auth = require('../middleware/auth');
const _ = require('lodash')
const { User } = require('../models/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


router.get('/getUsers', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Admin") res.status(403).send({ msg: 'Not an Admin' })
    let users = await User.find({Role: {$ne:"Admin"}}).select('Username Email Role Verified')

    return res.send(users)
})

router.get('/getUnverified', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Admin") res.status(403).send({ msg: 'Not an Admin' })
    let users = await User.find({Role: {$ne:"Admin"},Verified:false}).select('Username Email Role Verified')

    return res.send(users)
})

router.put('/verify/:Username', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Admin") res.status(403).send({ msg: 'Not an Admin' })

    user = await User.findOne({ Username: req.params.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })

    let result = await User.findOneAndUpdate({Username: req.params.Username}, { $set: { Verified: true }}, { new: true }).select('Username Email Role Verified')

    return res.send(result)
})

router.delete('/remove/:Username', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Admin") res.status(403).send({ msg: 'Not an Admin' })

    user = await User.findOne({ Username: req.params.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })

    let result = await User.findOneAndDelete({Username: req.params.Username}).select('Username Email Role Verified')

    return res.send(result)
})

module.exports = router