const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const adminRoutes = require('./routes/adminRoutes')
const professorRoutes = require('./routes/professorRoutes')
// const studentRoutes = require('./routes/studentRoutes')
const binomeRoutes = require('./routes/binomeRoutes')
const viewRoutes = require('./routes/viewRoutes')
const globalErrorHandler = require('./controllers/errorController')
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))
//---- body parser : reading data from body into req.body
app.use(express.json({ limit: '10kb' })) // the result of post request is undefined without this statment -- i mean middelware
app.use(cookieParser())

// STATIC FILES :
app.use(express.static(path.join(__dirname, 'public')))

// TEMPLATING ENGINE :
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//4) ROUTE
app.use('/', viewRoutes)
app.use('/admin', adminRoutes)
app.use('/professor', professorRoutes)
// app.use('/student', studentRoutes)
app.use('/binome', binomeRoutes)

// handel unhandeled route
app.all('*', (req, res, next) => {
  const url = req.originalUrl
  return res.status(404).render('not-found', {
    layout: false,
    url,
  })
})
app.use(globalErrorHandler)
module.exports = app
