const Joi = require('joi')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const { User, validateSignUp } = require('../models/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

// ------------------------------------------------------------------------------------------

// Signin

router.post('/signin', async (req, res) => {
  const { error } = validateSignIn(req.body)
  if (error) return res.status(400).send({ msg: error.details[0].message })

  let user = await User.findOne({ Username: req.body.Username })
  if (!user) return res.status(404).send({ msg: 'UserNotFound' })

  const validPassword = await bcrypt.compare(req.body.Password, user.Password)
  if (!validPassword) return res.status(404).send({ msg: 'IncorrectPassword' })

  const token = user.generateAuthToken()

  res.send({ token: token, user })
})

function validateSignIn (req) {
  const schema = {
    Username: Joi.string()
      .min(3)
      .max(15)
      .required()
      .token()
      .regex(new RegExp("^[a-zA-Z]+[a-zA-Z0-9]{1,}$"))
      .regex(new RegExp(".*[0-9]+.*")),
      Password: Joi.string()
      .min(8)
      .max(25)
      .regex(new RegExp(".*[0-9]+.*"))
      .regex(new RegExp(".*[A-Z]+.*"))
      .required()
  }

  return Joi.validate(req, schema)
}

// ----------------------------------------------------------------------------------

// signUp

router.post('/signup', async (req, res) => {
  const { error } = validateSignUp(req.body)
  if (error) return res.status(400).send({ msg: error.details[0].message })

  let user = await User.findOne({ Username: req.body.Username })
  if (user) return res.status(404).send({ msg: 'Username already registered.' })

  user = new User(
    _.pick(req.body, ['Username', 'Email', 'Password', 'Firstname'
    ,'Lastname','Gender','Birthdate','City','Address','Role'])
  )

  const salt = await bcrypt.genSalt(10)
  user.Password = await bcrypt.hash(user.Password, salt)
  // await user.save()

  const token = user.generateAuthToken()

  await user.save()
  // return res
  //   .header('auth-token', token)
  //   .send(_.pick(user, ['_id', 'Username', 'Email']));
  return res
    // .header('token', token)
    .send({ token: token, user })
  }
)




module.exports = router
