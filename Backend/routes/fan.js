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

 
    const Username = user.Username
    const Email = user.Email
    var Password = user.Password
    const validPassword = await bcrypt.compare(req.body.OldPassword, user.Password)
    if (!validPassword) return res.status(404).send({ msg: 'IncorrectPassword' })
    else {
        if (req.body.NewPassword)
        {
            const salt = await bcrypt.genSalt(10)
            Password = await bcrypt.hash(req.body.NewPassword, salt)
        }
    }

    const Firstname = req.body.Firstname || user.Firstname
    const Lastname = req.body.Lastname || user.Lastname
    const Gender = req.body.Gender || user.Gender
    const Birthdate = req.body.Birthdate || user.Birthdate
    const City = req.body.City || user.City
    const Address = req.body.Address || user.Address


    const newUser = new User({
        'Username': Username,
        'Email': Email,
        'Password': Password,
        'City': City,
        'Address': Address,
        'Firstname': Firstname,
        'Lastname': Lastname,
        'Gender': Gender,
        'Birthdate': Birthdate
    })

    // newUser.validate(function(err) {
    //     if (err) { return res.status(400).send({ msg: err }) }
    // })

    const err = newUser.validateSync()
    if(!!err) return res.status(400).send({ msg: err.message })

    newUser = _.pick(newUser, ['Username', 'Email', 'Password', 'City',
    'Address', 'Firstname', 'Lastname', 'Gender', 'Birthdate'])

    const { error } = validateSignUp(newUser)
    if (error) return res.status(400).send({ msg: error.details[0].message })

    const updatedUser = await User.findOneAndUpdate({ Username: req.user.Username},
        { $set:
          {
            Username: Username,
            Email: Email,
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

    var dim = [SeatStatus.length, SeatStatus[0].length];
    if(req.body.row >= dim[0] || req.body.column >= dim[1]) return res.status(404).send({ msg: 'Seat Index Doesnt Exist'})

    if(match.SeatStatus[req.body.row][req.body.column]) return res.status(404).send({ msg: 'Seat already Reserved'})

    let row = req.body.row
    let column = req.body.column
    let ticket = { id:new mongoose.Types.ObjectId(), matchID: match._id, row: row, column: column };

    try{
        new Fawn.Task()
          .update('matches',{_id:match._id},{$set: {'SeatStatus.row.column' : 1},$inc:{Reserved:1},$inc:{Vacant:-1}})
          .update('users',{_id:user._id},{ $push: {ReservedTickets:ticket}})
          .run()
    }
    catch(ex) {
        res.status(500).send('Failed to Reserve')
    }
    
})

module.exports = router