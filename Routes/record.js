const express = require('express')
const router = express.Router()
const Record = require('../models/record')

// List all expenses
router.get('/', (req, res) => {
  Record.find()
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
router.get('/new', (req, res) => {
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
router.post('/', (req, res) => {
  const { name, category, date, amount } = req.body
  const record = new Record({
    name,
    category,
    date,
    amount
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// see one's detail
router.get('/:id', (req, res) => {
  Record.findOne({ _id: req.params.id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('detail', { record })
    })
})

// edit one expense
router.get('/:id/edit', (req, res) => {
  Record.findOne({ _id: req.params.id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('edit', { record })
    })
})

// edit one expense action
router.put('/:id', (req, res) => {
  Record.findOne({ _id: req.params.id }, (err, record) => {
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
router.delete('/:id/delete', (req, res) => {   // 之後改成delete
  Record.findOne({ _id: req.params.id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/records')
    })
  })
})

module.exports = router