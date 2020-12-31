const auth = require('../middleware/auth');
const _ = require('lodash')
const { Stadium, validateStadium } = require('../models/stadium')
const { Match, validateMatch } = require('../models/match')
const { User } = require('../models/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


router.post('/addStadium', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Manager") res.status(403).send({ msg: 'Not a Manager' })

    const { error } = validateStadium(req.body)
    if (error) return res.status(400).send({ msg: error.details[0].message })
    stadium = new Stadium(_.pick(req.body, ['Name', 'Length', 'Width']))

    await stadium.save()
    return res.send(stadium)
})

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

router.post('/addMatch', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Manager") res.status(403).send({ msg: 'Not a Manager' })

    const { error } = validateMatch(req.body)
    if (error) return res.status(400).send({ msg: error.details[0].message })

    let stadium = await Stadium.findOne({ Name: req.body.MatchVenue })
    if (!stadium) return res.status(404).send({ msg: 'Stadium Not Found' })

    req.body.SeatStatus = zeros([stadium.Length, stadium.Width])
    let match = new Match(_.pick(req.body, ['HomeTeam', 'AwayTeam', 'MatchVenue'
    , 'Date', 'MainReferee', 'LinemanOne', 'LinemanTwo', 'SeatStatus']))

    await match.save()
    return res.send(match)
})

module.exports = router