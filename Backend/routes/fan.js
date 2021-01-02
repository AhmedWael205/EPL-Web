const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const { User,validateSignUp } = require('../models/user')
const { Stadium } = require('../models/stadium')
const { Match } = require('../models/match')
const mongoose = require('mongoose')
const Fawn = require('fawn')
const express = require('express')
const router = express.Router()

Fawn.init(mongoose)

router.get('/data', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Fan") res.status(403).send({ msg: 'Not an Fan' })
    
    return res.send(_.pick(user, ['Firstname', 'Lastname', 'Gender', 'Birthdate', 'City', 'Address']))
})


router.put('/editData',auth,async (req, res) => {

    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Fan") res.status(403).send({ msg: 'Not a Fan' })

    var Password = user.Password
    if(req.body.Password) {
        const validPassword = await bcrypt.compare(req.body.Password, user.Password)
        if (!validPassword) return res.status(404).send({ msg: 'Incorrect Password' })
        else {
            if (req.body.NewPassword)
            {
                const salt = await bcrypt.genSalt(10)
                Password = await bcrypt.hash(req.body.NewPassword, salt)
            }
        }
    } else {
        return res.status(404).send({ msg: 'You need to write your Password to edit your Data' })
    }

    const Username = user.Username
    const Email = user.Email
    const Role = user.Role
    const Firstname = req.body.Firstname || user.Firstname
    const Lastname = req.body.Lastname || user.Lastname
    const Gender = req.body.Gender || user.Gender
    const Birthdate = req.body.Birthdate || user.Birthdate
    const City = req.body.City || user.City
    const Address = req.body.Address || user.Address


    let newUser = new User({
        'Username': Username,
        'Email': Email,
        'Password': Password,
        'City': City,
        'Address': Address,
        'Firstname': Firstname,
        'Lastname': Lastname,
        'Gender': Gender,
        'Birthdate': Birthdate,
        'Role':Role
    })

    // newUser.validate(function(err) {
    //     if (err) { return res.status(400).send({ msg: err }) }
    // })

    const err = newUser.validateSync()
    if(!!err) return res.status(400).send({ msg: err.message })

    newUser = _.pick(newUser, ['Username', 'Email', 'Password', 'City',
    'Address', 'Firstname', 'Lastname', 'Gender', 'Birthdate','Role'])

    const { error } = validateSignUp(newUser)
    if (error) return res.status(400).send({ msg: error.details[0].message })

    const updatedUser = await User.findOneAndUpdate({ Username: req.user.Username},
        { $set:
          {
            Password: Password,
            City: City,
            Address: Address,
            Firstname: Firstname,
            Lastname: Lastname,
            Gender: Gender,
            Birthdate: Birthdate }
        }, { new: true })

    return res.send(updatedUser)
})

router.put('/reserveMatch', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Fan") res.status(403).send({ msg: 'Not an Fan' })

    let match = await Match.findById(req.body.id)
    if (!match) return res.status(404).send({ msg: 'No Match exists with the given id'})

    let date_ob = new Date();
    let timeDifference = (new Date(match.Date) - date_ob )
    // let differentDays = (timeDifference / (1000 * 3600 * 24));

    if(timeDifference<0) return res.status(404).send({ msg: 'You cant reserve a match with starting date in the past'})

    var dim = [match.SeatStatus.length, match.SeatStatus[0].length];
    if(req.body.row >= dim[0] || req.body.column >= dim[1]) return res.status(404).send({ msg: 'Seat Index Doesnt Exist'})

    if(match.SeatStatus[req.body.row][req.body.column]) return res.status(404).send({ msg: 'Seat already Reserved'})

    for (const ticket of user.ReservedTickets){
        timeDifference = Math.abs(new Date(ticket.Date) - new Date(match.Date))
        let differentHours = (timeDifference / (1000 * 3600));
        if(String(match._id) !== String(ticket.matchID) && differentHours < 2) return res.status(404).send({ msg: 'This match is clashing with another reserved match'})
    }

    let row = req.body.row
    let column = req.body.column
    let ticket = { _id:new mongoose.Types.ObjectId(), matchID: match._id,HomeTeam:match.HomeTeam 
        , AwayTeam:match.AwayTeam, Date:match.Date,row: row, column: column };
    let Index = 'SeatStatus.'+String(row)+'.'+String(column)

    try{
        new Fawn.Task()
          .update('matches',{_id:new mongoose.Types.ObjectId(match._id)},{$inc: { [Index] : 1,'Vacant':-1, 'Reserved':1}})
          .update('users',{_id:new mongoose.Types.ObjectId(user._id)},{ $push: {'ReservedTickets':ticket}})
          .run()
    }
    catch(ex) {
        res.status(500).send('Failed to Reserve')
    }

    
    // const updatedMatch = await Match.findOneAndUpdate({_id:new mongoose.Types.ObjectId(match._id)},
    // {$inc: { [Index] : 1,'Vacant':-1, 'Reserved':1}}, { new: true })
    // console.log(updatedMatch)

    // const updatedUser = await User.findOneAndUpdate({_id:new mongoose.Types.ObjectId(user._id)},{ $push: {'ReservedTickets':ticket}}, { new: true })
    // console.log(updatedUser)
    return res.send(ticket)
})

router.get('/ReservedTickets', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Fan") res.status(403).send({ msg: 'Not an Fan' })
    
    return res.send(_.pick(user, ['ReservedTickets']))
})

router.delete('/cancelReservation/:id', auth,async (req, res) => {
    
    let user = await User.findOne({ Username: req.user.Username })
    if (!user) return res.status(404).send({ msg: 'UserNotFound' })
    if (user.Role != "Fan") res.status(403).send({ msg: 'Not an Fan' })

          .update('matches',{_id:new mongoose.Types.ObjectId(matchID)},{$inc: { [Index] : -1,'Vacant':1, 'Reserved': -1}})
    let ticket = await User.findOne({ Username: req.user.Username, ReservedTickets:{$elemMatch: { _id: new mongoose.Types.ObjectId(req.params.id) }}})
    if (!ticket) return res.status(404).send({ msg: 'Ticket Not Found' })
    var result = ticket.ReservedTickets.filter(obj => { return String(obj._id) === String(req.params.id) })
    ticket = result[0]
    let date_ob = new Date();
    let timeDifference = (new Date(ticket.Date) - date_ob )
    if(timeDifference<0) return res.status(404).send({ msg: 'You cant cancel the reservation of a played match'})
    
    let differentDays = (timeDifference / (1000 * 3600 * 24));

    if(differentDays<3) return res.status(404).send({ msg: 'You can only cancel a reservation if the starting date is after 3 days'})
    let matchID = ticket.matchID
    let row = ticket.row
    let column = ticket.column
    let Index = 'SeatStatus.'+String(row)+'.'+String(column)

    try{
        new Fawn.Task()
          .update('matches',{_id:new mongoose.Types.ObjectId(matchID)},{$inc: { [Index] : -1,'Vacant':1, 'Reserved': -1}})
          .update('users',{_id:new mongoose.Types.ObjectId(user._id)}, { $pull: { 'ReservedTickets': { '_id': new mongoose.Types.ObjectId(ticket._id) } } })
          .run()
    }
    catch(ex) {
        res.status(500).send('Failed to Cancel Reservation')
    }
    return res.send(ticket)
})


module.exports = router