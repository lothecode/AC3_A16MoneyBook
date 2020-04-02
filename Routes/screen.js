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
  if (selectCategory === '' && selectMonth !== '') {
    querys = { userId, date: { $regex: findMonth } }
  } else if (selectCategory !== '' && selectMonth === '') {
    querys = { userId, category: selectCategory }
    showCategory = categories[selectCategory].category_ch
  } else if (selectCategory !== '' && selectMonth !== '') {
    querys = { userId, category: selectCategory, date: { $regex: findMonth } }
    showCategory = categories[selectCategory].category_ch
  }

  Record
    .find(querys)
    .sort(sort(selectOrder))
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      let total = 0
      records.forEach(item => {
        total += item.amount
        item.icon = categories[item.category].icon
      })
      return res.render('index', {
        categories,
        records,
        total,
        selectCategory,
        showCategory,
        selectMonth,
        showMonth: months[selectMonth],
        selectOrder,
        showOrder: orders[selectOrder]
      })
    })
})
module.exports = router
