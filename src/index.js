const express = require('express')
const Sequelize = require('sequelize')
const config = require('./config/database')
const { errorHandler, ApiError } = require('./middlewares/error-handler')
const routes = require('./routes/clients')

const app = express()
const sequelize = new Sequelize(config[process.env.NODE_ENV])

app.use(express.json())

app.use('/clients', routes)
app.use('/', () => {
  throw new ApiError('Route not found.', 404)
})

app.use((error, req, res, next) => errorHandler(error, res))

sequelize.authenticate()
  .then(() => {
    console.log(`Everything ok on port ${process.env.NODE_ENV} :)`)

    app.listen(process.env.PORT)
  })
  .catch(console.log)
