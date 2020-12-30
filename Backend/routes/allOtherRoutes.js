const express = require('express')
const router = express.Router()

router.get('*', async (req, res) => {
  return res.status(404).send({ msg: 'Invalid Route' })
})

router.post('*', async (req, res) => {
  return res.status(404).send({ msg: 'Invalid Route' })
})

module.exports = router
