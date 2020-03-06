const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Handlebars = require('handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

// 載入model
const Record = require('./models/record')
const User = require('./models/user')

// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true
}))

// 設定連線到 mongoDB的expense資料庫
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection
// 連線異常及成功
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => { console.log('mongodb connected!') })

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

// 載入路由器
app.use('/users', require('./Routes/user'))
app.use('/', require('./Routes/home'))
app.use('/screen', require('./Routes/screen'))
app.use('/records', require('./Routes/record'))


app.listen(3000, () => {
  console.log('APP is running on express')
})
