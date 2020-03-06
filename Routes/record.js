const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')


// List all expenses
router.get('/', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      let total = 0
      records.forEach(item => {
        total += item.amount
      })
      return res.render('index', { records, total })
    })
})

// Add new expense
router.get('/new', authenticated, (req, res) => {
  {
    const today = new Date
    const year = today.getFullYear()
    let month = today.getMonth() + 1
    let date = today.getDate()
    if (month < 10) {
      month = `0${month}`
    }
    if (date < 10) {
      date = `0${date}`
    }
    let listdate = `${year}-${month}-${date}`
    return res.render('new', { listdate })
  }
})

// Add new expense action
router.post('/', authenticated, (req, res) => {
  const record = new Record({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    userId: req.user._id
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// see one's detail
router.get('/:id', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('detail', { record })
    })
})

// edit one expense
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('edit', { record })
    })
})

// edit one expense action
router.put('/:id', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.name = req.body.name,
      record.category = req.body.category,
      record.date = req.body.date,
      record.amount = req.body.amount,
      record.save((err) => {
        if (err) return console.error(err)
        return res.redirect(`/records/${req.params.id}`)
      })
  })
})

//delete one expense action
router.delete('/:id/delete', authenticated, (req, res) => {   // 之後改成delete
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/records')
    })
  })
})

module.exports = router