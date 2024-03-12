const { promisify } = require('util')
const Admin = require('../models/adminModel')
const Professor = require('../models/professorModel')
const Student = require('../models/studentModel')
const jwt = require('jsonwebtoken')
//-----------------------------------
const signToekn = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
//-----------------------------------
exports.signup = async (req, res) => {
  try {
    let role
    if (req.originalUrl === '/admin/signup') {
      role = 'admin'
    } else if (req.originalUrl === '/professor/signup') {
      role = 'professor'
    } else if (req.originalUrl === '/student/signup') {
      role = 'student'
    } else {
      role = 'invalid'
    }
    let user
    switch (role) {
      case 'professor':
        user = await Professor.create(req.body)
        break
      case 'student':
        user = await Student.create(req.body)
        break
      case 'admin':
        user = await Admin.create(req.body)
        break
      default:
        return res.status(400).json({ message: 'Invalid user role' })
    }
    // Generate JWT token
    const token = signToekn(user._id)
    // Send response with token
    res.status(201).json({
      status: 'success',
      token,
      user,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
//-----------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'opps! you forgot to provide your password or email',
      })
    }
    let role
    if (req.originalUrl === '/admin/login') {
      role = 'admin'
    } else if (req.originalUrl === '/professor/login') {
      role = 'professor'
    } else if (req.originalUrl === '/student/login') {
      role = 'student'
    } else {
      role = 'invalid'
    }

    // Find user by email
    let user
    switch (role) {
      case 'professor':
        user = await Professor.findOne({ email }).select('+password')
        break
      case 'student':
        user = await Student.findOne({ email }).select('+password')
        break
      case 'admin':
        user = await Admin.findOne({ email }).select('+password')
        break
      default:
        return res.status(400).json({
          status: 'fail',
          message: 'your not allowed to access from here ',
        })
    }
    //********** check if the user exist:
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'no user found with this credentials , please try again!',
      })
    }
    // ********  check if the password correct :
    if (!(await user.correctPassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'invalid email or password , try again !',
      })
    }
    // Generate JWT token
    const token = signToekn(user._id)
    // store the token in user cookies :
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    }
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true
    }
    res.cookie('token', token, cookieOptions)
    // Send response with token
    res.status(200).json({
      status: 'success',
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

//---------------------------------
exports.logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    message: 'you are logged out',
  })
}
//---------------------------------
exports.protect = async (req, res, next) => {
  const token = req.cookies['token']
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in. Please log in and try again',
    })
  }
  // Verification of the token:
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // Determine the role based on the URL path
  let role
  const path = req.originalUrl.toLowerCase()
  if (path.startsWith('/admin')) {
    role = 'admin'
  } else if (path.startsWith('/professor')) {
    role = 'professor'
  } else if (path.startsWith('/student')) {
    role = 'student'
  } else {
    role = 'invalid'
  }

  // Check if the user still exists based on the determined role
  let user
  switch (role) {
    case 'admin':
      user = await Admin.findById(decoded.id)
      break
    case 'professor':
      user = await Professor.findById(decoded.id)
      break
    case 'student':
      user = await Student.findById(decoded.id)
      break
    default:
      return res.status(401).json({
        status: 'fail',
        message: 'opps! you do not have access',
      })
  }

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token does no longer exist',
    })
  }
  // Assign the authenticated user and role to the request object
  req.authenticated = true
  req.user = user
  req.role = role
  next()
}
