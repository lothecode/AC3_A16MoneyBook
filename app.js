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

app.listen(3000, () => {
  console.log('APP is running on express')
})