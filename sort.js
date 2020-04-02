function sort(selectOrder) {
  let showOrder = '時間或金額排序'
  let order = ''
  switch (selectOrder) {
    case 'dateAsc':
      order = { date: 'asc' }
      showOrder = '時間 (舊->新)'
      break

    case 'dateDesc':
      order = { date: 'desc' }
      showOrder = '時間 (新->舊)'
      break
    case 'amountDesc':
      order = { amount: 'desc' }
      showOrder = '金額 (多->少)'
      break
    case 'amountAsc':
      order = { amount: 'asc' }
      showOrder = '金額 (少->多)'
      break
    default:
      break
  }
  return order
}

module.exports = sort