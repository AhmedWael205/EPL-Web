const Joi = require('joi')
const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
    HomeTeam: {
      type: String,
      enum: ['ENPPI',	'Aswan', 'El Gaish', 'El Gouna'
      , 'El Entag El Harby', 'Ceramica Cleopatra', 'National Bank', 'Wadi Degla'
      , 'Pyramids', 'Al Ittihad', 'Al Mokawloon', 'Zamalek'
      , 'Al Masry', 'Ismaily', 'Al Ahly'
      , 'Misr lel Makkasa', 'Somouha', 'Ghazl El Mahalla'],
      required:true
    },
    AwayTeam: {
      type: String,
      enum: ['ENPPI',	'Aswan', 'El Gaish', 'El Gouna'
      , 'El Entag El Harby', 'Ceramica Cleopatra', 'National Bank', 'Wadi Degla'
      , 'Pyramids', 'Al Ittihad', 'Al Mokawloon', 'Zamalek'
      , 'Al Masry', 'Ismaily', 'Al Ahly'
      , 'Misr lel Makkasa', 'Somouha', 'Ghazl El Mahalla'],
      required:true,
      validate: {
        validator: function() {
          if (this.AwayTeam === this.HomeTeam) {
            return false;
          }
        },
        message: props => "Home Team and Away Team can't be the same"
      }
    },
    MatchVenue: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128
    },
    Date: {
      type: Date,
      required: true
    },
    MainReferee: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 25
    },
    LinemanOne: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 25
    },
    LinemanTwo: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 25
    },
    SeatStatus: [[Number]],
    Vacant: Number,
    Reserved: Number
})

const Match = mongoose.model('matches', matchSchema)

function validateMatch (match) {
    const schema = {
      HomeTeam: Joi.string()
        .required(),
      AwayTeam: Joi.string()
        .required(),
      MatchVenue: Joi.string()
        .min(3)
        .max(128)
        .required(),
      Date: Joi.date()
        .iso()
        .required(),
      MainReferee: Joi.string()
        .min(3)
        .max(25)
        .required(),
      LinemanOne: Joi.string()
        .min(3)
        .max(25)
        .required(),
      LinemanTwo: Joi.string()
        .min(3)
        .max(25)
        .required(),

    }
  
    return Joi.validate(match, schema)
  }
  
  exports.Match = Match
  exports.validateMatch = validateMatch
  