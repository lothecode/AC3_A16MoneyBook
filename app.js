const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB的expense資料庫
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



// 載入record model
const Record = require('./models/record')

app.get('/', (req, res) => {
  return res.redirect('/records')
})

app.get('/records', (req, res) => {
  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      let totalAmount = 1000  // 不會寫??
      return res.render('index', { records: records, total: totalAmount })
    })
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

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

app.get('/records/:id', (req, res) => {
  res.send('one detail')
})

app.get('/records/:id/edit', (req, res) => {
  res.send('edit one')
})

app.post('/records/:id/edit', (req, res) => {  // 之後改成put
  res.send('edit one PUT')
})

app.post('/records/:id/delete', (req, res) => {   // 之後改成delete
  res.send('delete one')
})

app.listen(3000, () => {
  console.log('APP is running on express')
})

