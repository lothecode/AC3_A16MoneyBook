const express = require('express')
const router = express.Router()

// Home, redirect to list all expenses page
router.get('/', (req, res) => {
  return res.redirect('/records')
})

module.exports = router

