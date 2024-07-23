const AppError = require('../utilities/appError')

const handelCastErrorDB = (err) => {
  const message = `invalid ${err.path} : ${err.value}`
  return new AppError(message, 400)
}

const handelDuplicateFieldsDB = (err) => {
  const message = `duplicate field ${Object.keys(err.keyPattern)
    .toString()
    .toUpperCase()} : ${
    Object.values(err.keyValue)[0]
  } please use another value`
  return new AppError(message, 400)
}

const handelValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `invalid input data : ${errors.join(' |')}`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}
const sendErrorProd = (err, res) => {
  // error that we trust , send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    // programming or other unkown error , send a generic error message
    console.error('ERROR 💥', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong ! please try again later',
    })
  }
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  // })
  if (process.env.NODE_ENV === 'developement') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = err
    if (error.name === 'CastError') {
      error = handelCastErrorDB(error)
    }
    if (error.name === 'ValidationError') {
      error = handelValidationError(error)
    }
    if (error.code === 11000) {
      error = handelDuplicateFieldsDB(error)
    }
    sendErrorProd(error, res)
  }
}
