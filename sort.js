function sort(selectOrder) {
  let order = ''
  switch (selectOrder) {
    case 'dateAsc':
      order = { date: 'asc' }
      break
    case 'dateDesc':
      order = { date: 'desc' }
      break
    case 'amountDesc':
      order = { amount: 'desc' }
      break
    case 'amountAsc':
      order = { amount: 'asc' }
      break
    default:
      break
  }
  return order
}

module.exports = sort