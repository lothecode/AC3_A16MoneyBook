const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  res.send('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email }).then(user => {
    if (user) {
      console.log('User already exists')
      res.render('register', {
        name,
        email,
        password,
        password2
      })
    } else {
      const newUser = new User({
        name,
        email,
        password,
      })
      newUser.save()
        .then(user => {
          res.redirect('login')
        })
        .catch(err => console.log(err))
    }
  })
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router