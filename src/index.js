const express = require('express')
const Sequelize = require('sequelize')
const config = require('./config/database')

const app = express()
const sequelize = new Sequelize(config[process.env.NODE_ENV])

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
