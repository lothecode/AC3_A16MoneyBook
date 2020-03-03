const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB的expense資料庫

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection
// 連線異常及成功
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 1; i <= 10; i++) {
    Record.create({
      name: 'expense-' + i,
      amount: i * 100
    })
  }
  console.log('seeder done!')
})
