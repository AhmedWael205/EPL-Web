const Joi = require('joi')
const mongoose = require('mongoose')


const stadiumSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
      unique: true
    },
    Length: {
      type: Number,
      required: true,
      min: 3,
      max: 20
    },
    Width: {
      type: Number,
      required: true,
      min: 3,
      max: 20
    }
})

const Stadium = mongoose.model('stadiums', stadiumSchema)

function validateStadium (stadium) {
    const schema = {
      Name: Joi.string()
        .min(3)
        .max(128)
        .required(),
      Length: Joi.number()
        .integer()
        .min(3)
        .max(20)
        .required(),
      Width: Joi.number()
        .integer()
        .min(3)
        .max(20)
        .required()
    }
  
    return Joi.validate(stadium, schema)
  }
  
  exports.Stadium = Stadium
  exports.validateStadium = validateStadium
  