const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Handlebars = require('handlebars')

// 設定連線到 mongoDB的expense資料庫
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection
// 連線異常及成功
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => { console.log('mongodb connected!') })

// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// 載入model
const Record = require('./models/record')

// Handlebars Helper
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

// Home, redirect to list all expenses page
app.get('/', (req, res) => {
  return res.redirect('/records')
})

// List all expenses
app.get('/records', (req, res) => {
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

// see one's detail
app.get('/records/:id', (req, res) => {
  Record.findOne({ _id: req.params.id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('detail', { record })
    })
})


// Add new expense
app.get('/new', (req, res) => {
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
app.post('/records', (req, res) => {
  const record = new Record({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// edit one expense
app.get('/records/:id/edit', (req, res) => {
  Record.findOne({ _id: req.params.id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('edit', { record })
    })
})

// edit one expense action
app.post('/records/:id/edit', (req, res) => {  // 之後改成put
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
app.post('/records/:id/delete', (req, res) => {   // 之後改成delete
  Record.findOne({ _id: req.params.id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/records')
    })
  })
})

// sort by category
app.get('/screen/:screen', (req, res) => {
  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      if (req.params.screen === 'all') {
        return res.redirect('/records')
      } else {
        const results = records.filter(item => {
          return item.category === req.params.screen
        })
        let total = 0
        results.forEach(item => {
          total += item.amount
        })
        return res.render('index', { records: results, total })
      }
    })
})

app.listen(3000, () => {
  console.log('APP is running on express')
})
