const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('This will be a MoneyBook app')
})

app.listen(port, () => {
  console.log('APP is running on express')
})