const express = require('express')
const Sequelize = require('sequelize')
const config = require('./config/database')
const routes = require('./routes/clients')

const app = express()
const sequelize = new Sequelize(config[process.env.NODE_ENV])

app.use(express.json())

app.use('/clients', routes)
app.use('/', (req, resp) => {
  return resp.status(404).send({
    status: 'error',
    statusCode: 404,
    message: 'Route not found. Try using routes /clients or /wishlists'
  })
})

sequelize.authenticate()
  .then(() => {
    console.log(`Everything ok on port ${process.env.NODE_ENV} :)`)

    app.listen(process.env.PORT)
  })
  .catch(console.log)
