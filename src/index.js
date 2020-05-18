const express = require('express')
const Sequelize = require('sequelize')

const app = express()
const sequelize = new Sequelize({
  username: 'postgres',
  password: 'ebom',
  database: 'postgres',
  host: 'db',
  dialect: 'postgres'
})

app.use(express.json())
app.use('/', (req, resp) => {
  resp.status(200).send('ok')
})

sequelize.authenticate()
  .then(() => {
    console.log(`Everything ok on port ${process.env.NODE_ENV} :)`)

    app.listen(process.env.PORT)
  })
  .catch(console.log)
