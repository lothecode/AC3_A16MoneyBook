const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB的expense資料庫

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection
// 連線異常及成功
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => { console.log('mongodb connected!') })

// 載入record model
const Record = require('./models/record')

app.get('/', (req, res) => {
  res.send('This will be a MoneyBook app')
})

app.get('/records', (req, res) => {
  res.send('list all')
})

app.get('/records/new', (req, res) => {
  res.send('create new one')
})

app.post('/records', (req, res) => {
  res.send('create new one POST')
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