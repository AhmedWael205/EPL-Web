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
    if (user.Role != "Manager") return res.status(403).send({ msg: 'Not a Manager' })
    if (!user.Verified) return res.status(401).send({ msg: 'The user is not verified yet' })


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
    if (user.Role != "Manager") return res.status(403).send({ msg: 'Not a Manager' })
    if (!user.Verified) return res.status(401).send({ msg: 'The user is not verified yet' })


    const { error } = validateMatch(req.body)
    if (error) return res.status(400).send({ msg: error.details[0].message })

    let stadium = await Stadium.findOne({ Name: req.body.MatchVenue })
    if (!stadium) return res.status(404).send({ msg: 'Stadium Not Found' })

    req.body.SeatStatus = zeros([stadium.Length, stadium.Width])
    req.body.Vacant = stadium.Length * stadium.Width
    req.body.Reserved = 0
    let match = new Match(_.pick(req.body, ['HomeTeam', 'AwayTeam', 'MatchVenue'
            , 'Date', 'MainReferee', 'LinemanOne', 'LinemanTwo'
            , 'SeatStatus','Vacant','Reserved']))
    

    await match.save()
    return res.send(match)
})

router.get('/Matches',async (req, res) => {
    
    let matches = await Match.find().select('-SeatStatus')
    if (!matches) return res.status(404).send({ msg: 'No Matches' })

    return res.send(matches)
})

router.get('/viewMatch/:id',async (req, res) => {

    let match = await Match.findById(req.params.id).select('-SeatStatus')
    if (!match) return res.status(404).send({ msg: 'No Match exists with the given id'})

    return res.send(match)
})

router.get('/viewSeatStatus/:id',async (req, res) => {

    let match = await Match.findById(req.params.id)
    if (!match) return res.status(404).send({ msg: 'No Match exists with the given id'})

    return res.send(_.pick(match, ['SeatStatus']))
})

router.put('/editMatch/:id',auth,async (req, res) => {

    // Manager is not allowed to change the Venue

    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Manager") return res.status(403).send({ msg: 'Not a Manager' })
    if (!user.Verified) return res.status(401).send({ msg: 'The user is not verified yet' })


    let match = await Match.findById(req.params.id)
    if (!match) return res.status(404).send({ msg: 'No Match exists with the given id'})
    
 
    const HomeTeam = req.body.HomeTeam || match.HomeTeam
    const AwayTeam = req.body.AwayTeam || match.AwayTeam
    // const MatchVenue = req.body.MatchVenue || match.MatchVenue
    const MatchVenue =  match.MatchVenue
    const Date = req.body.Date || match.Date
    const MainReferee = req.body.MainReferee || match.MainReferee
    const LinemanOne = req.body.LinemanOne || match.LinemanOne
    const LinemanTwo = req.body.LinemanTwo || match.LinemanTwo

    var newMatch = new Match({
        HomeTeam: HomeTeam,
        AwayTeam: AwayTeam,
        MatchVenue: MatchVenue,
        Date: Date,
        MainReferee: MainReferee,
        LinemanOne: LinemanOne,
        LinemanTwo: LinemanTwo
    })

    // newMatch.validate(function(err) {
    //     if (err) { return res.status(400).send({ msg: err }) }
    // })

    const err = newMatch.validateSync()
    if(!!err) return res.status(400).send({ msg: err.message })

    newMatch = _.pick(newMatch, ['HomeTeam', 'AwayTeam', 'MatchVenue'
    , 'Date', 'MainReferee', 'LinemanOne', 'LinemanTwo'])

    const { error } = validateMatch(newMatch)
    if (error) return res.status(400).send({ msg: error.details[0].message })

    const updateMatch = await Match.findOneAndUpdate({ _id: req.params.id},
        { $set:
          {
            HomeTeam: HomeTeam,
            AwayTeam: AwayTeam,
            MatchVenue: MatchVenue,
            Date: Date,
            MainReferee: MainReferee,
            LinemanOne: LinemanOne,
            LinemanTwo: LinemanTwo }
        }, { new: true })

    return res.send(updateMatch)
})

router.get('/vacantReserved', auth, async (req, res) => {

    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Manager") return res.status(403).send({ msg: 'Not a Manager' })
    
    let matches = await Match.find().select('HomeTeam AwayTeam Date Vacant Reserved')
    if (!matches) return res.status(404).send({ msg: 'No Matches' })

    return res.send(matches)
})

module.exports = router