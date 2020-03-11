const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categories = require('../data/categories.json')
const months = require('../data/months.json')
const { authenticated } = require('../config/auth')

// sort by category
router.get('/?', authenticated, (req, res) => {
  const selectCategory = req.query.cat || ''
  const selectMonth = req.query.month || ''
  const selectOrder = req.query.sort
  const findMonth = new RegExp(selectMonth, 'g') // 含有selectMonth的字串, 'g'flag: global search
  const userId = req.user._id
  let querys = { userId }
  let showCategory = '類別 (全部)'
  let showMonth = '月份 (全部)'
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
  let order = { date: 'desc' }
  let showOrder = '時間或金額排序'
  if (selectOrder === 'dateAsc') {
    order = { date: 'asc' }
    showOrder = '時間 (舊->新)'
  } else if (selectOrder === 'dateDesc') {
    order = { date: 'desc' }
    showOrder = '時間 (新->舊)'
  } else if (selectOrder === 'amountDesc') {
    order = { amount: 'desc' }
    showOrder = '金額 (多->少)'
  } else if (selectOrder === 'amountAsc') {
    order = { amount: 'asc' }
    showOrder = '金額 (少->多)'
  }
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
      // 選擇類別後保留選項在畫面 ??

      return res.render('index', { categories, records, total, selectCategory, selectMonth, showMonth, showCategory, showOrder })

    })
})
module.exports = router
