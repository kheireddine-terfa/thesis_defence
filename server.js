const mongoose = require('mongoose')
const dotenv = require('dotenv')
//----------------------------------
process.on('uncaughtException', (err) => {
  console.log('uncaught Exception 💥 , shutting down ... ')
  console.log(err.name, err.message)
  process.exit(1)
})
//-----------------------------------
dotenv.config({ path: './config.env' }) //read the variables from this file and save them into nodeJS environment variables

const app = require('./app.js')
const DB = process.env.LOCAL_DATABASE

// const DB = process.env.DATABASE
// connect to mongoDB data base
mongoose
  .connect(DB, {
    //return a promise
  })
  .then((con) => {
    console.log('db connection successful!')
  })
// 5) START THE SERVER:
const port = process.env.PORT || 3000
// listen to incomming request
const server = app.listen(port, () => {
  console.log(`start listening on port ${port}...`)
})
process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection 💥 , shutting down ... ')
  console.log(err.name, err.message)
  console.log(err)
  server.close(() => {
    process.exit(1)
  })
})
