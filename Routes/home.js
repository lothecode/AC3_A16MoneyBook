const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')

// Home, redirect to list all expenses page
router.get('/', authenticated, (req, res) => {
  return res.redirect('/records')
})

module.exports = router

