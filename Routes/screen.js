const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categories = require('../data/categories.json')
const months = require('../data/months.json')
const { authenticated } = require('../config/auth')
const sort = require('../sort')
const orders = require('../data/order.json')

// group by month & category,and sort
router.get('/?', authenticated, (req, res, next) => {
  const selectCategory = req.query.cat || ''
  const selectMonth = req.query.month || ''
  const selectOrder = req.query.sort
  const findMonth = new RegExp(selectMonth, 'g') // 含有selectMonth的字串, 'g'flag: global search
  const userId = req.user._id
  let querys = { userId }
  let showCategory = '類別 (全部)'
  let showMonth = '月份 (全部)'
  // 用keywords作為判斷條件, 將要篩選or排序的條件加入querys這個{}中, 成為後面find的條件式
  if (selectCategory === '' && selectMonth !== '') {
    querys = { userId, date: { $regex: findMonth } }
    showMonth = months[selectMonth].month_ch
  } else if (selectCategory !== '' && selectMonth === '') {
    querys = { userId, category: selectCategory }
    showCategory = categories[selectCategory].category_ch
  } else if (selectCategory !== '' && selectMonth !== '') {
    querys = { userId, category: selectCategory, date: { $regex: findMonth } }
    showCategory = categories[selectCategory].category_ch
    showMonth = months[selectMonth].month_ch
  }
  order = sort(selectOrder)
  showOrder = orders[selectOrder]
  Record
    .find(querys)
    .sort(order)
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      let total = 0
      records.forEach(item => {
        total += item.amount
        item.icon = categories[item.category].icon
      })
      return res.render('index', { categories, records, total, selectCategory, selectMonth, showMonth, showCategory, selectOrder, showOrder })
    })
})
module.exports = router
