const mongoose = require('mongoose')
const Record = require('../record')
const member = require('../seeds/namelist.json')
const bill = require('../seeds/bills')
const User = require('../user')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }) // 設定連線到 mongoDB的expense資料庫
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection
// 連線異常及成功
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => {
  console.log('mongodb connected!')
  let namelist = member.namelist
  for (let i of namelist) {
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(i.password, salt, (err, hash) => {
        const user = new User({
          name: i.name,
          email: i.email,
          password: hash
        })
        user.save((err) => {
          if (err) return console.error(err)
        })

        let list = bill.records
        for (let mybill of list) {
          i.select.forEach(id => {
            if (mybill.id === id) {
              Record.create({
                name: mybill.name,
                category: mybill.category,
                date: mybill.date,
                amount: mybill.amount,
                userId: user._id
              })
            }
          })
        }
      }
      ))
  }
})

console.log('done')
