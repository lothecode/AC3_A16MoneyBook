const express = require('express')
const Handlebars = require('handlebars')
const router = express.Router()
const Record = require('../models/record')
const categories = require('../data/categories.json')
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
        item.icon = categories[item.category].icon
      })
      return res.render('index', { categories, records, total })
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
    const listdate = `${year}-${month}-${date}`
    return res.render('new', { categories, listdate })
  }
})

// Add new expense action
router.post('/', authenticated, (req, res) => {
  if (req.body.amount <= 0 || !Number(req.body.amount)) {
    return res.render('new', {
      name: req.body.name,
      category: req.body.category,
      listdate: req.body.date,
      warning_msg: '金額必需為大於0的數字'
    })
  } else {
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
  }
})

// edit one expense
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('edit', { categories, record })
    })
})

// edit one expense action
router.put('/:id', authenticated, (req, res) => { // 先用post, 之後改成put
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.name = req.body.name,
      record.category = req.body.category,
      record.date = req.body.date,
      record.amount = req.body.amount,
      record.save((err) => {
        if (err) return console.error(err)
        return res.redirect(`/records`)
      })
  })
})

//delete one expense action
router.delete('/:id/delete', authenticated, (req, res) => {   // 先用post, 之後改成delete
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/records')
    })
  })
})

// Handlebars Helper 用來在template裡做if equal or not的判斷式, 原本handlebars只能做if true/false的判斷, 本專案沒有用到!==這個condition
Handlebars.registerHelper('ifCond', function (v1, op, v2, options) {
  switch (op) {
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this);
  }
})

module.exports = router