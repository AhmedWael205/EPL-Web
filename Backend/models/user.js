const config = require('config')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 25,
    unique: true
  },
  Email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 128,
  },
  Password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },

  Firstname: {
    type: String,
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 15,
    
  },
  Lastname: {
    type: String,
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 15,
    
  },

  Gender: {
    type: String,
    enum: ['Male', 'Female'],
    required:true
  },

  Birthdate: {
    type: Date,
    required: true
  },

  City: {
    type: String,
    required: true
  },

  Address: {
    type: String,
    default: null
  },
  Role: {
    type: String,
    enum: ['Manager','Fan'],
    required: true
  },
  Verified: { type: Boolean, default: false },
  ReservedTickets: [{
    type: new mongoose.Schema({
      id: mongoose.Schema.Types.ObjectId,
      matchID: mongoose.Schema.Types.ObjectId,
      HomeTeam: {
        type: String,
        enum: ['ENPPI',	'Aswan', 'El Gaish', 'El Gouna'
      , 'El Entag El Harby', 'Ceramica Cleopatra', 'National Bank', 'Wadi Degla'
      , 'Pyramids', 'Al Ittihad', 'Al Mokawloon', 'Zamalek'
      , 'Al Masry', 'Ismaily', 'Al Ahly'
      , 'Misr lel Makkasa', 'Somouha', 'Ghazl El Mahalla'],
      },
      AwayTeam: {
        type: String,
        enum: ['ENPPI',	'Aswan', 'El Gaish', 'El Gouna'
        , 'El Entag El Harby', 'Ceramica Cleopatra', 'National Bank', 'Wadi Degla'
        , 'Pyramids', 'Al Ittihad', 'Al Mokawloon', 'Zamalek'
        , 'Al Masry', 'Ismaily', 'Al Ahly'
        , 'Misr lel Makkasa', 'Somouha', 'Ghazl El Mahalla'],
        validate: {
          validator: function() {
            if (this.AwayTeam === this.HomeTeam) {
              return false;
            }
          },
          message: props => "Home Team and Away Team can't be the same"
        }
      },
      Date:Date,
      row: Number,
      column: Number
    })
  }]
  
})


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, Role: this.Role, Username:this.Username },
    config.get('jwtPrivateKey') 
  )
  return token
}

const User = mongoose.model('users', userSchema)
const pattern = "^[a-zA-Z]{2,}$"
const pattern2 = "^[a-zA-Z]+[a-zA-Z0-9]{1,}$"


function validateUser (user) {
  const schema = {
    Username: Joi.string()
      .min(3)
      .max(15)
      .required()
      .token()
      .regex(new RegExp(pattern2))
      .regex(new RegExp(".*[0-9]+.*")),
    Email: Joi.string()
      .min(5)
      .max(128)
      .required()
      .email(),
    Password: Joi.string()
      .min(8)
      .max(1024)
      .regex(new RegExp(".*[0-9]+.*"))
      .regex(new RegExp(".*[A-Z]+.*"))
      .required(),
    Firstname: Joi.string()
      .min(2)
      .max(15)
      .required()
      .regex(new RegExp(pattern)),
    Lastname: Joi.string()
      .min(2)
      .max(15)
      .required()
      .regex(new RegExp(pattern)),
    Birthdate: Joi.date()
      .iso()
      .required()
      .max('1-1-2004'),
    City: Joi.string()
      .required()
      .regex(new RegExp(pattern)),
    Role: Joi.string(),
    Gender: Joi.string(),
    Address: Joi.string()
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validateSignUp = validateUser
