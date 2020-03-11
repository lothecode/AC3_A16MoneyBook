const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categories = require('../data/categories.json')
const { authenticated } = require('../config/auth')

// sort by category
router.get('/:screen', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
    .lean()
    .exec((err, records) => {
      let selectCategory = req.params.screen
      if (err) return console.error(err)
      // 依據選擇的類別找出結果
      if (selectCategory === 'all') {
        return res.redirect('/records')
      } else {
        const results = records.filter(item => {
          return item.category === selectCategory
        })
        // 計算選出來之類別總金額
        let total = 0
        results.forEach(item => {
          total += item.amount
          item.icon = categories[item.category].icon
        })
        // 選擇類別後保留選項在畫面
        showCat = categories[selectCategory].category_ch
        return res.render('index', { categories, showCat, records: results, total })
      }
    })
})
module.exports = router
