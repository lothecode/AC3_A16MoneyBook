const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Handlebars = require('handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

// 載入model
const Record = require('./models/record')
const User = require('./models/user')

// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定連線到 mongoDB的expense資料庫
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection
// 連線異常及成功
db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => { console.log('mongodb connected!') })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true
}))
// 要在 middleware 中使用 Passport，先要透過 passport.initialize() 來初始化 Passport。然後用 passport.session() 來啟動 session 功能。注意：passport.session() 要放在 session() 之後，才能確保執行順序正確。
app.use(passport.initialize())
app.use(passport.session())

// 載入 Passport config
require('./config/passport')(passport)
// 登入後可以取得使用者的資訊方便在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

// 載入路由器
app.use('/users', require('./Routes/user'))
app.use('/', require('./Routes/home'))
app.use('/screen', require('./Routes/screen'))
app.use('/records', require('./Routes/record'))

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

app.listen(3000, () => {
  console.log('APP is running on express')
})
